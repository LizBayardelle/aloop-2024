class Order < ApplicationRecord
  belongs_to :user, optional: true
  has_many :product_orders
  has_many :products, through: :order_items
  has_many :order_items
 
 
  def order_number_of_items
    order_number_of_items = 0
    self.order_items.each do |item|
      order_number_of_items += item.quantity
    end
    order_number_of_items
  end

  def order_total
    order_total = 0
    self.order_items.each do |item|
      product = Product.find(item.product_id)
      order_total += ( product.price * item.quantity )
    end
    order_total
  end

  def price
    order_total = 0
    self.order_items.each do |item|
      product = Product.find(item.product_id)
      order_total += ( product.price * item.quantity )
    end
    order_total
  end


end
