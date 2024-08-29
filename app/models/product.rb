class Product < ApplicationRecord
    has_many :product_categorizations, dependent: :destroy
    has_many :product_categories, through: :product_categorizations
  
    has_many :orders
    has_many :order_items
    has_many :orders, through: :order_items
  
    has_many :components, dependent: :destroy
    has_many :variants, through: :components
  
    def display_price
      min_price = calculate_min_price
      max_price = calculate_max_price
  
      if min_price == max_price
        format_price(min_price)
      else
        "#{format_price(min_price)} - #{format_price(max_price)}"
      end
    end
  
    def calculate_price_for_variants(variant_ids)
      variants.where(id: variant_ids).sum(:price)
    end
    
    def undertitle
        strings_array = []
        strings_array << self.subtitle if self.subtitle.present?
        strings_array.join(', ')
    end

    private
  
    def calculate_min_price
      components.map { |component| component.variants.minimum(:price) || 0 }.sum
    end
  
    def calculate_max_price
      components.map { |component| component.variants.maximum(:price) || 0 }.sum
    end
  
    def format_price(price)
      "$#{sprintf('%.2f', price)}"
    end

end

    
