class ComponentSerializer < ActiveModel::Serializer
    attributes :id, :name, :description, :active
  
    belongs_to :product
    has_many :variants
end