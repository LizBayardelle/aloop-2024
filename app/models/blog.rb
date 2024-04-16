class Blog < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged
  
  has_one_attached :image

  belongs_to :user
  has_many :blog_categorizations
  has_many :blog_categories, through: :blog_categorizations

end
