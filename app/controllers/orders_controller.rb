class OrdersController < ApplicationController
  before_action :set_order, only: %i[ update destroy ]
  require 'shippo'

  def index
    @orders = Order.all
  end

  def show
    if Order.find_by(id: params[:id])
      @order = Order.find(params[:id])
    else
      @order = @current_order 
    end

    # Only create Shippo shipment if we're at the shipping step
    create_shippo_shipment if params[:step] == 'shipping'
  end

  def create
    @order = Order.new(order_params)

    respond_to do |format|
      if @order.save
        format.html { redirect_to order_url(@order), notice: "Order was successfully created." }
        format.json { render :show, status: :created, location: @order }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to order_url(@order) }
        format.json { render :show, status: :ok, location: @order }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @order.destroy

    respond_to do |format|
      format.html { redirect_to orders_url, notice: "Order was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def mark_order_paid
    @order = Order.find(params[:id])
    if @order.update(paid: true, order_status: 'paid')
      @current_order = Order.create!
      session[:order_id] = @current_order.id

      redirect_to order_path(@order)
    else
      redirect_to order_path(@order)
      flash[:warning] = "Oops! Something went wrong!"
    end
  end

  private

  def create_shippo_shipment
    Shippo::API.token = ENV["SHIPPO_API_TOKEN"]

    params = {
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
      @shipment = Shippo::Shipment.create(params)
    rescue Shippo::Exceptions::APIServerError => e
      Rails.logger.error "Shippo API Error: #{e.message}"
      Rails.logger.error "Response: #{e.response.body}" if e.response
      @shipment = nil
      flash[:error] = "There was an error calculating shipping rates. Please try again later."
    rescue => e
      Rails.logger.error "Unexpected error in Shippo API call: #{e.message}"
      @shipment = nil
      flash[:error] = "An unexpected error occurred. Please try again later."
    end
  end

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :id,
      :user_id,
      :price,
      :token,
      :move_to_checkout,
      :paid,
      :shipping_info,
      :ship_to_name,
      :customer_email,
      :address_line_1,
      :address_line_2,
      :city,
      :state,
      :postal_code,
      :country,
      :shipping_chosen,
      :shipping_choice,
      :shipping_method_name,
      :shipping_choice_img,
      :shipping_cost,
      :final_price,
      :paypal_order_id,
      :paypal_payer_id,
      :paypal_payer_email,
      :paypal_payment_status,
      :paypal_transaction_id,
      :order_status
    )
  end
end