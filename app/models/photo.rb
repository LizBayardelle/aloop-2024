class Photo < ApplicationRecord
  has_one_attached :image

  validates :image, content_type: { in: %w[image/jpeg image/png image/gif image/webp], message: "must be a JPEG, PNG, GIF, or WebP" },
                    size: { less_than: 10.megabytes, message: "must be less than 10MB" }

  scope :with_valid_images, -> { joins(image_attachment: :blob) }

  def thumbnail
    if image.variable?
      image.variant(resize_to_fill: [400, 400], format: :webp, saver: { quality: 80 })
    else
      image
    end
  end

  def display_image
    if image.variable?
      image.variant(resize_to_limit: [1200, 1200], format: :webp, saver: { quality: 85 })
    else
      image
    end
  end
end
