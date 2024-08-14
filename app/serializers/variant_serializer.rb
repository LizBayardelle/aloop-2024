class VariantSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :name, :description, :price, :active, :sku, :vendor, :vendor_parts_number, :component_id, :photo_urls

  has_many :bike_models

  def photo_urls
    object.photos.map do |photo|
      {
        id: photo.id,
        url: rails_blob_path(photo, only_path: true),
        thumbnail: rails_blob_path(photo, only_path: true)
      }
    end
  rescue => e
    Rails.logger.error "Error generating photo_urls for variant #{object.id}: #{e.message}"
    []
  end
end