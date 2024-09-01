# app/mailers/admin_mailer.rb
class AdminMailer < ApplicationMailer
    include VariantFinderHelper
  
    def new_order_notification(order_data, order_items_data)
      @order = order_data
      @order_items = order_items_data.map do |item|
        Rails.logger.debug "Processing order item: #{item.inspect}"
        product = Product.find(item['product_id'])
        Rails.logger.debug "Found product: #{product.inspect}"
        variants = find_variants_from_specs(item['specs'], product.name)
        Rails.logger.debug "Product: #{product.name}"
        Rails.logger.debug "Specs: #{item['specs']}"
        Rails.logger.debug "Found Variants: #{variants.inspect}"
        item.merge('variants' => variants, 'product_name' => product.name)
      end
      mail(
        to: 'lizbayardelle@gmail.com',
        subject: "New Order Received - ##{@order['id']}"
      )
    end
  end