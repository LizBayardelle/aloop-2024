class Api::V1::AdminNotificationsController < ApplicationController
  def create
    order = Order.includes(order_items: { product: :variants }).find(params[:order][:id])
    
    order_data = order.attributes
    order_items_data = order.order_items.map do |item|
      item_data = item.attributes
      item_data['product_name'] = item.product.name
      item_data['variants'] = item.product.variants.where(id: item.selected_variant_ids).map do |variant|
        {
          id: variant.id,
          name: variant.name,
          price: variant.price,
          sku: variant.sku,
          vendor: variant.vendor,
          vendor_parts_number: variant.vendor_parts_number
        }
      end
      item_data
    end

    begin
      # Send admin notification
      AdminMailer.new_order_notification(order_data, order_items_data).deliver_now
      Rails.logger.info "Admin notification email sent successfully for order #{order.id}"
      
      # Send customer confirmation
      OrderMailer.order_confirmation(order_data, order_items_data).deliver_now
      Rails.logger.info "Customer confirmation email sent successfully for order #{order.id}"
      
      head :ok
    rescue StandardError => e
      Rails.logger.error "Failed to send notification emails for order #{order.id}: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      head :internal_server_error
    end
  end
end