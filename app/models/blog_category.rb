class BlogCategory < ApplicationRecord
    has_many :blog_categorizations
    has_many :blogs, through: :blog_categorizations
end
