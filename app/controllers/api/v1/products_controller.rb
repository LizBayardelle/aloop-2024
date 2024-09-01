class Api::V1::ProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]

  def index
    @products = Product.includes(components: { variants: [:bike_models, photos_attachments: :blob] }, main_photos_attachments: :blob)
    render json: @products, each_serializer: ProductSerializer, include: ['components', 'components.variants', 'main_photos']
  end

  def show
    render json: @product, serializer: ProductSerializer, include: ['components', 'components.variants', 'main_photos']
  end

  def create
    @product = Product.new(product_params)

    if @product.save
      render json: @product, status: :created, location: api_v1_product_url(@product), serializer: ProductSerializer, include: ['main_photos']
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params.except(:main_photos))
      # Handle main photos
      if params[:product][:main_photo_ids].present?
        existing_photos = @product.main_photos.where(id: params[:product][:main_photo_ids])
        photos_to_delete = @product.main_photos.where.not(id: params[:product][:main_photo_ids])
        photos_to_delete.purge
        @product.main_photos = existing_photos
      end

      # Attach new photos
      @product.main_photos.attach(params[:product][:main_photos]) if params[:product][:main_photos].present?

      # Update product categories
      @product.product_category_ids = params[:product][:product_category_ids] if params[:product][:product_category_ids]

      render json: @product, serializer: ProductSerializer, include: ['main_photos']
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    head :no_content
  end

  def remove_photo
    @product = Product.find(params[:id])
    photo = @product.main_photos.find(params[:photo_id])
    
    if photo.purge
      render json: { message: 'Photo successfully deleted' }, status: :ok
    else
      render json: { error: 'Failed to delete photo' }, status: :unprocessable_entity
    end
  end

  private

  def set_product
    @product = Product.includes(components: :variants, main_photos_attachments: :blob).find(params[:id])
  end

  def product_params
    params.require(:product).permit(
      :id,
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
      product_category_ids: [],
      main_photos: []
    )
  end
end