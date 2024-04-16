class OrdersController < ApplicationController
  before_action :set_order, only: %i[ update destroy ]
  require 'shippo'

  def index
    @orders = Order.all
  end


  def show
    if Order.find(params[:id])
      @order = Order.find(params[:id])
    else
      @order = @current_order 
    end


    # Setup your API token
    Shippo::API.token = ENV["SHIPPO_API_TOKEN"]  # not an actual valid token

    # Setup query parameter hash
    params   = {  async:          false,
                  address_from:   {
                    name:           'Aloop Offroad',
                    company:        'Aloop Offroad',
                    street1:        'PO Box 412',
                    street2:        '',
                    city:           'Sedalia',
                    state:          'CO',
                    zip:            '80135',
                    country:        'US',
                    phone:          '+1 303 550 2582'
                  },

                  address_to:     {
                    name:           @order.ship_to_name,
                    street1:        @order.address_line_1,
                    street2:        @order.address_line_2,
                    city:           @order.city,
                    state:          @order.state,
                    zip:            @order.postal_code,
                    country:        @order.country,
                    email:          @order.customer_email
                  },

                  parcels: {
                    length:        5,
                    width:         2,
                    height:        5,
                    distance_unit: :in,
                    weight:        2,
                    mass_unit:     :lb
                  }

    }

    # Make our API call
    @shipment = Shippo::Shipment.create(params)


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
    if @order.update(paid: true)

      @current_order = Order.create!
      session[:order_id] = @current_order.id

      redirect_to order_path(@order)
    else
      redirect_to order_path(@order)
      flash[:warning] = "Oops! Something went wrong!"
    end
  end
  

  private


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
      :shipping_choice_img,
      :shipping_price,
      :final_price
    )
  end
end
