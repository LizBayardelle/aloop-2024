class Api::V1::ProductsController < ApplicationController
    before_action :set_product, only: [:show, :update, :destroy]
  
    def index
      @products = Product.includes(components: { variants: [:bike_models, photos_attachments: :blob] })
      render json: @products, each_serializer: ProductSerializer, include: ['components', 'components.variants']
    end
  
    def show
      @product = Product.includes(components: { variants: [:bike_models, photos_attachments: :blob] }).find(params[:id])
      render json: @product, serializer: ProductSerializer, include: ['components', 'components.variants']
    end
  
    def create
      @product = Product.new(product_params)
  
      if @product.save
        render json: @product, status: :created, location: api_v1_product_url(@product)
      else
        render json: @product.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @product.update(product_params)
        render json: @product
      else
        render json: @product.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @product.destroy
    end
  
    private
  
    def set_product
      @product = Product.includes(components: :variants).find(params[:id])
    end
  
    def product_params
      params.require(:product).permit(
        :name, 
        :subtitle, 
        :description, 
        :active, 
        :application_notes, 
        :height, 
        :price,
        :size,
        :width, 
        :depth, 
        :meta_title, 
        :meta_keywords, 
        product_category_ids: [])
    end
end