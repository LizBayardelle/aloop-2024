class ProductSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :active, :meta_title, :meta_keywords,
             :height, :width, :depth, :subtitle, :price, :size, :application_notes,
             :display_price, :all_photos_urls

  has_many :components, serializer: ComponentSerializer
  has_many :product_categories

  def price
    object.display_price
  end

  def display_price
    object.display_price
  end

  def all_photos_urls
    object.components.flat_map do |component|
      component.variants.flat_map do |variant|
        variant.photos.map { |photo| generate_photo_url(photo) }
      end
    end
  end

  private

  def generate_photo_url(photo)
    Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: false)
  end
end