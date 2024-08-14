class ComponentSerializer < ActiveModel::Serializer
    attributes :id, :name, :description, :product_id, :active
  
    belongs_to :product
    has_many :variants
end