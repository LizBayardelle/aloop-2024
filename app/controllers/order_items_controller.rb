class OrderItemsController < ApplicationController
   
  def create
    puts params.inspect
    
    # if OrderItem.where(order_id: @current_order.id, product_id: params[:order_item][:product_id]).count != 0
    #   @order_item = OrderItem.where(order_id: @current_order.id, product_id: params[:order_item][:product_id]).first
    #   @order_item.quantity += params[:order_item][:quantity].to_i
    #   @order_item.save
    # else
      @order_item = OrderItem.new(order_params)
    # end

    if @order_item.save
      redirect_to order_path(@current_order)
    else
      flash[:error] = 'There was a problem adding this item to your order.'
      redirect_to products_path
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
      :order_id,
      :product_id,
      :quantity,
      :specs,
      :notes,
      :total_price
    )
  end

end

