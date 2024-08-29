class Api::V1::OrdersController < ApplicationController
	before_action :set_current_order
	before_action :set_order, only: [:show, :update, :shipping_rates]

	require 'shippo'
  

	def index
		@orders = Order.order(created_at: :desc)
		render json: @orders
	end

	def show
		@order = Order.find(params[:id])
		serialized_order = OrderSerializer.new(@order).as_json
		Rails.logger.debug "Serialized Order: #{serialized_order.inspect}"
		render json: serialized_order
	end

  
	def update
		paypal_payment_amount = params[:order].delete(:paypal_payment_amount)
		paypal_payment_currency = params[:order].delete(:paypal_payment_currency)
	  
		if @order.update(order_params)
		  if paypal_payment_amount.present?
			@order.update(final_price: paypal_payment_amount)
		  end
	  
		  if @order.paypal_payment_status == 'COMPLETED'
			@order.update(paid_at: Time.current)
			
			puts "Resetting the order"
			new_order = Order.create!
			session[:order_id] = new_order.id
			@current_order = new_order
		  end
	  
		  render json: @order, include: ['order_items', 'order_items.product']
		else
		  render json: { errors: @order.errors }, status: :unprocessable_entity
		end
	end



	def calculate_shipping_rates
	  @order = Order.find(params[:id])
	  fetch_shipping_rates
	end
  

	def shipping_rates
	  Rails.logger.info "Shipping rates requested for order #{params[:id]}"
	  @order = Order.find(params[:id])
	  fetch_shipping_rates
	end
  

	def fetch_shipping_rates
	  @order = Order.find(params[:id])
	
	  unless @order.shipping_info_complete?
		render json: { error: "Shipping information is incomplete" }, status: :unprocessable_entity
		return
	  end
	
	  Shippo::API.token = ENV["SHIPPO_API_TOKEN"]
	
	  shippo_params = {
		async: false,
		address_from: {
		  name: 'Aloop Offroad',
		  company: 'Aloop Offroad',
		  street1: 'PO Box 412',
		  street2: '',
		  city: 'Sedalia',
		  state: 'CO',
		  zip: '80135',
		  country: 'US',
		  phone: '+1 303 550 2582'
		},
		address_to: {
		  name: @order.ship_to_name,
		  street1: @order.address_line_1,
		  street2: @order.address_line_2,
		  city: @order.city,
		  state: @order.state,
		  zip: @order.postal_code,
		  country: @order.country,
		  email: @order.customer_email
		},
		parcels: {
		  length: 5,
		  width: 2,
		  height: 5,
		  distance_unit: :in,
		  weight: 2,
		  mass_unit: :lb
		}
	  }
  
	  begin
		shipment = Shippo::Shipment.create(shippo_params)
		
		# Manually serialize the rates
		serialized_rates = shipment.rates.map do |rate|
		  {
			id: rate.object_id,
			amount: rate.amount,
			currency: rate.currency,
			provider: rate.provider,
			service_level: rate.servicelevel.name,
			estimated_days: rate.estimated_days,
			duration_terms: rate.duration_terms
		  }
		end
		
		render json: serialized_rates
	  rescue Shippo::Exceptions::APIServerError => e
		Rails.logger.error "Shippo API Error: #{e.message}"
		render json: { error: "Error calculating shipping rates" }, status: :service_unavailable
	  rescue => e
		Rails.logger.error "Unexpected error in Shippo API call: #{e.message}"
		render json: { error: "An unexpected error occurred" }, status: :internal_server_error
	  end
	end

  
	private

	def set_order
		@order = Order.find(params[:id])
	end

	def order_params
		params.require(:order).permit(
		  :paid, :token, :price, :move_to_checkout, :shipping_info,
		  :address_line_1, :address_line_2, :city, :state, :postal_code, :country,
		  :ship_to_name, :shipping_chosen, :shipping_choice, :shipping_choice_img, :shipping_method_name,
		  :shipping_cost, :customer_email, :final_price,
		  :paypal_order_id, :paypal_payer_id, :paypal_payer_email,
		  :paypal_payment_status, :paypal_transaction_id, :order_status,
		  :paid_at
		)
	end



  end