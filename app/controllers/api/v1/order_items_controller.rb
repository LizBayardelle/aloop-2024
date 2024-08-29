class Api::V1::OrderItemsController < ApplicationController
	
	def create
		order = current_order
		order_item = order.order_items.new(order_item_params)

		if order_item.save
			render json: { status: 'success', order_item: order_item }, status: :created
		else
			render json: { status: 'error', errors: order_item.errors.full_messages }, status: :unprocessable_entity
		end
	end

    def destroy
		order_item = OrderItem.find(params[:id])
		
		if order_item.destroy
			render json: { message: 'Order item successfully deleted' }, status: :ok
		else
			render json: { error: 'Failed to delete order item' }, status: :unprocessable_entity
		end
    end

    private

    def current_order
		@current_order
    end
  
    def order_item_params
		params.require(:order_item).permit(
			:product_id,
			:quantity,
			:specs,
			:notes,
			selected_variant_ids: []
		)
    end


end