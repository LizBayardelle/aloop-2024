# app/mailers/order_mailer.rb
class OrderMailer < ApplicationMailer
  def order_confirmation(order_data, order_items_data)
    @order = order_data
    @order_items = order_items_data
    @customer_email = @order['customer_email'] || @order['paypal_payer_email']
    
    mail(
      to: @customer_email,
      subject: "Order Confirmation - Aloop Offroad ##{@order['id'].to_s.rjust(6, '0')}"
    )
  end

  def shipping_notification(order)
    @order = order
    mail(
      to: order.customer_email,
      subject: "Your Order Has Shipped - Aloop Offroad ##{@order.id.to_s.rjust(6, '0')}"
    )
  end
end