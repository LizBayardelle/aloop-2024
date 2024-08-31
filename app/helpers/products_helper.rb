module ProductsHelper
    def find_main_image(product)
        product.components.each do |component|
            component.variants.each do |variant|
            return variant.photos.first if variant.photos.attached? && variant.photos.first.present?
            end
        end
        nil
    end
end