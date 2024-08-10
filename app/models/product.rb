class Product < ApplicationRecord
	
	has_many :product_categorizations, dependent: :destroy
	has_many :product_categories, through: :product_categorizations

	has_many :orders
	has_many :order_items
	has_many :orders, through: :order_items

	has_many :components, dependent: :destroy
    has_many :variants, through: :components

    def cheapest_variant_price
        variants.minimum(:price) || price
    end

	def undertitle
		strings_array = []
		if self.subtitle && self.subtitle != ""
        	strings_array << self.subtitle
        end
        # if self.years && self.years != ""
        # 	strings_array << "Fits " + self.years
        # end
        # if self.color && self.color != ""
        # 	strings_array << self.color
        # end
        undertitle = strings_array.join(', ')
        undertitle
    end
    
end
