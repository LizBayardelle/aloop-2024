class Product < ApplicationRecord
  include Rails.application.routes.url_helpers

  has_many :product_categorizations, dependent: :destroy
  has_many :product_categories, through: :product_categorizations

  has_many :orders
  has_many :order_items
  has_many :orders, through: :order_items

  has_many :components, dependent: :destroy
  has_many :variants, through: :components

  has_many_attached :main_photos

  def full_image_urls
    components.flat_map do |component|
      component.variants.flat_map do |variant|
        variant.photos.map { |photo| rails_blob_path(photo, only_path: true) }
      end
    end
  end

  def main_photos_urls
    main_photos.map { |photo| rails_blob_path(photo, only_path: true) }
  end

  def main_photos_count
    main_photos.count
  end

  def all_photos_urls
    main_photos_urls + full_image_urls
  end
  
  def display_price
    format_price(price)
  end

  def calculate_price_for_variants(variant_ids)
    price + variants.where(id: variant_ids).sum(:price_adjustment)
  end
  
  def undertitle
    strings_array = []
    strings_array << self.subtitle if self.subtitle.present?
    strings_array.join(', ')
  end

  private

  def format_price(price)
    "$#{sprintf('%.2f', price)}"
  end
end



  