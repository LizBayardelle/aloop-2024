class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product
  has_one_attached :image

  before_save :set_total_price

  private

  def set_total_price
    if selected_variant_ids.present?
      variant_prices = Variant.where(id: selected_variant_ids).pluck(:price)
      self.total_price = variant_prices.sum * quantity
    else
      self.total_price = quantity * product.cheapest_variant_price
    end
  end
end