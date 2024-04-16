class Blog < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged
  
  has_one_attached :image

  belongs_to :user
  has_many :blog_subcategorizations
  has_many :blog_subcategories, through: :blog_subcategorizations

end
