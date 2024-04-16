class Variant < ApplicationRecord
  has_many_attached :photos
  belongs_to :component

  has_many :variant_models
  has_many :bike_models, through: :variant_models


  def price_adjustment
    # self.price - Product.find(Component.find(self.component_id).product_id).price
  end
end
