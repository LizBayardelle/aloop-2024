class OrderSerializer < ActiveModel::Serializer
    attributes :id, :paid, :token, :price, :user_id, :move_to_checkout, :shipping_info,
               :address_line_1, :address_line_2, :city, :state, :postal_code, :country,
               :ship_to_name, :shipping_chosen, :shipping_choice, :shipping_choice_img, :shipping_method_name,
               :shipping_cost, :customer_email, :final_price, :created_at, :updated_at,
               :paypal_order_id, :paypal_payer_id, :paypal_payer_email,
               :paypal_payment_status, :paypal_transaction_id, :order_status, :paid_at
  
    has_many :order_items
  end