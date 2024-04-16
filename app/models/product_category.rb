class ProductCategory < ApplicationRecord
	has_many :product_categorizations
	has_many :products, through: :product_categorizations
end
