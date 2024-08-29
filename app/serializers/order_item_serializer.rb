class OrderItemSerializer < ActiveModel::Serializer
    attributes :id, :quantity, :specs, :notes, :total_price
  
    belongs_to :product
end