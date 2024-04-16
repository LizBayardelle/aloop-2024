class BlogSubcategorization < ApplicationRecord
  belongs_to :blog
  belongs_to :blog_subcategory
end
