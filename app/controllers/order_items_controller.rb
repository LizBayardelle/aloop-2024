class OrderItemsController < ApplicationController
   
  def create
    puts params.inspect
    
    @order_item = OrderItem.new(order_params)
    @order_item.order = @current_order
    
    # Convert the comma-separated string to an array of integers
    if params[:order_item][:selected_variant_ids].is_a?(String)
      @order_item.selected_variant_ids = params[:order_item][:selected_variant_ids].split(',').map(&:to_i)
    end

    if @order_item.save
      respond_to do |format|
        format.html { redirect_to order_path(@current_order) }
        format.json { render json: { status: 'success', order_item: @order_item } }
      end
    else
      respond_to do |format|
        format.html do
          flash[:error] = 'There was a problem adding this item to your order.'
          redirect_to products_path
        end
        format.json { render json: { status: 'error', errors: @order_item.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @order_item = OrderItem.find(params[:id])
    @order_item.destroy

    respond_to do |format|
      format.html { redirect_to order_path(@current_order), notice: "Poof!  All gone." }
      format.json { head :no_content }
    end
  end

  private

  def order_params
    params.require(:order_item).permit(
      :id,
      :product_id,
      :quantity,
      :specs,
      :notes,
      :total_price,
      selected_variant_ids: []
    )
  end
end