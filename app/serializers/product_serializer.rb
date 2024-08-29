class ProductSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :active, :meta_title, :meta_keywords,
             :height, :width, :depth, :subtitle, :price, :size, :application_notes,
             :display_price

  has_many :components
  has_many :product_categories

  def price
    object.cheapest_variant_price
  end

  def display_price
    object.display_price
  end
end