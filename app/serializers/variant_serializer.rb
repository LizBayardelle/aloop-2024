class VariantSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :name, :description, :price, :active, :sku, :vendor, :vendor_parts_number, :component_id, :photos_count, :photos_urls

  has_many :bike_models

  def photos_urls
    object.photos.map do |photo|
      {
        id: photo.id,
        url: rails_blob_url(photo, only_path: true)
      }
    end
  end

  def photos_count
    object.photos.count
  end

  private

  def generate_photo_url(photo, variant: nil)
    if variant
      rails_representation_url(photo.variant(variant).processed, only_path: false)
    else
      rails_blob_url(photo, only_path: false)
    end
  rescue => e
    Rails.logger.error "Error generating URL for photo #{photo.id}: #{e.message}"
    nil
  end
end