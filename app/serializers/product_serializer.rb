class ProductSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :name, :description, :active, :meta_title, :meta_keywords,
             :height, :width, :depth, :subtitle, :price, :size, :application_notes,
             :display_price, :all_photos_urls, :main_photos_urls, :main_photos_count

  has_many :components, serializer: ComponentSerializer
  has_many :product_categories

  def price
    object.display_price
  end

  def display_price
    object.display_price
  end

  def all_photos_urls
    main_photos_urls + variant_photos_urls
  end

  def main_photos_urls
    object.main_photos.map do |photo|
      {
        id: photo.id,
        url: rails_blob_url(photo, only_path: true)
      }
    end
  end

  def variant_photos_urls
    object.components.flat_map do |component|
      component.variants.flat_map do |variant|
        variant.photos.map { |photo| rails_blob_url(photo, only_path: true) }
      end
    end
  end

  def main_photos_count
    object.main_photos.count
  end

  private

  def rails_blob_url(blob, options = {})
    if blob.persisted?
      Rails.application.routes.url_helpers.rails_blob_path(blob, options)
    end
  end
end