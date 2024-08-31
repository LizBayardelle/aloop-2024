# app/helpers/variant_finder_helper.rb
module VariantFinderHelper
    def find_variants_from_specs(specs, product_name)
      Rails.logger.debug "Finding variants for specs: #{specs}"
      Rails.logger.debug "Product name: #{product_name}"
      variants = []
      specs.to_s.split("\n").each do |spec_line|
        component_name, variant_name = spec_line.split(": ").map(&:strip)
        Rails.logger.debug "Looking for component: #{component_name}, variant: #{variant_name}"
        
        product = Product.find_by(name: product_name)
        Rails.logger.debug "Found product: #{product.inspect}"
        if product
          component = product.components.find_by(name: component_name)
          Rails.logger.debug "Found component: #{component.inspect}"
          if component
            variant = component.variants.find_by(name: variant_name)
            Rails.logger.debug "Found variant: #{variant.inspect}"
            if variant
              variants << variant
            else
              Rails.logger.debug "No variant found for #{component_name}: #{variant_name}"
            end
          else
            Rails.logger.debug "No component found: #{component_name}"
          end
        else
          Rails.logger.debug "No product found: #{product_name}"
        end
      end
      Rails.logger.debug "Returning variants: #{variants.inspect}"
      variants
    end
  end