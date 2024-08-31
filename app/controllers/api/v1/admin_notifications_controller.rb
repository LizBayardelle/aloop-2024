class Api::AdminNotificationsController < ApplicationController
    def create
      order = Order.includes(:order_items).find(params[:order][:id])
      order_data = order.attributes
      order_items_data = order.order_items.map(&:attributes)
      AdminMailer.new_order_notification(order_data, order_items_data).deliver_later
      head :ok
    rescue StandardError => e
      Rails.logger.error "Failed to send admin notification: #{e.message}"
      head :internal_server_error
    end
end