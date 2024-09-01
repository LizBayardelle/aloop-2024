class Variant < ApplicationRecord
  has_many_attached :photos
  belongs_to :component

  has_many :variant_models
  has_many :bike_models, through: :variant_models

  def price_adjustment
    self.price
  end

  def photos_urls
    photos.map { |photo| Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: false) }
  end

  def photos_count
    photos.count
  end
end