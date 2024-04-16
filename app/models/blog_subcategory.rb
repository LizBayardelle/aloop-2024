class BlogSubcategory < ApplicationRecord
  has_many :blog_subcategorizations
  has_many :blogs, through: :blog_subcategorizations
end
