class Api::V1::VariantsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_variant, only: [:show, :update, :destroy]
  
    
    def index
      @variants = Variant.includes(:component, :bike_models, photos_attachments: :blob)
      render json: @variants, each_serializer: VariantSerializer
    end
  

    def show
      @variant = Variant.includes(:component, :bike_models, photos_attachments: :blob).find(params[:id])
      render json: @variant, serializer: VariantSerializer
    end
  
    
    def create
      @variant = Variant.new(variant_params)
  
      if @variant.save
        render json: @variant, status: :created, location: api_v1_variant_url(@variant)
      else
        render json: @variant.errors, status: :unprocessable_entity
      end
    end
  
    def images
      variant_ids = params[:variant_ids].split(',')
      variants = Variant.where(id: variant_ids)
      
      image_urls = variants.each_with_object({}) do |variant, hash|
        hash[variant.id] = variant.photos_urls.first if variant.photos_urls.present?
      end
    
      render json: image_urls
    end
    
    
    def update
      if @variant.update(variant_params_without_photos)
        if params[:variant][:photos].present?
          @variant.photos.attach(params[:variant][:photos])
        end
        render json: @variant
      else
        render json: @variant.errors, status: :unprocessable_entity
      end
    end
  
    
    def destroy
      @variant.destroy
    end

    def remove_photo
      @variant = Variant.find(params[:id])
      photo = @variant.photos.find(params[:photo_id])
      
      if photo.purge
        render json: { message: 'Photo successfully deleted' }, status: :ok
      else
        render json: { error: 'Failed to delete photo' }, status: :unprocessable_entity
      end
    end
  
    private
  
    def set_variant
      @variant = Variant.find(params[:id])
    end

    def variant_params_without_photos
      params.require(:variant).permit(
        :name,
        :component_id,
        :price,
        :sku,
        :vendor,
        :vendor_parts_number,
        :description,
        :active,
        bike_model_ids: []
      )
    end
  
    def variant_params
      params.require(:variant).permit(
        :name,
        :component_id,
        :price,
        :sku,
        :vendor,
        :vendor_parts_number,
        :description,
        :active,
        bike_model_ids: [],
        photos: []
      )
    end
end