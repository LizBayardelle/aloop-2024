class OrderSerializer < ActiveModel::Serializer
  attributes :id, :paid, :token, :price, :user_id, :move_to_checkout, :shipping_info,
             :address_line_1, :address_line_2, :city, :state, :postal_code, :country,
             :ship_to_name, :shipping_chosen, :shipping_choice, :shipping_choice_img, :shipping_method_name,
             :shipping_cost, :customer_email, :final_price, :created_at, :updated_at,
             :paypal_order_id, :paypal_payer_id, :paypal_payer_email,
             :paypal_payment_status, :paypal_transaction_id, :order_status, :paid_at

  has_many :order_items

  class OrderItemSerializer < ActiveModel::Serializer
    attributes :id, :quantity, :total_price, :product

    def product
      {
        id: object.product.id,
        name: object.product.name,
        image_url: product_image_url(object.product)
      }
    end

    private

    def product_image_url(product)
      # Try to find the first image from components, variants, or the product itself
      image = product.components.flat_map(&:variants).flat_map(&:photos).first ||
              product.photos.first

      if image
        Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
      else
        '/assets/placeholder.jpg'
      end
    end
  end
end