class Api::V1::ComponentsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_component, only: [:show, :update, :destroy]
  
    def index
      @components = Component.includes(variants: { photos_attachments: :blob })
      render json: @components, each_serializer: ComponentSerializer
    end
  
    def show
      @component = Component.includes(variants: { photos_attachments: :blob }).find(params[:id])
      render json: @component, serializer: ComponentSerializer
    end
  
    def create
      @component = Component.new(component_params)
  
      if @component.save
        render json: @component, status: :created, location: api_v1_component_url(@component)
      else
        render json: @component.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @component.update(component_params)
        render json: @component
      else
        render json: @component.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @component.destroy
    end
  
    private
  
    def set_component
      @component = Component.includes(:variants).find(params[:id])
    end
  
    def component_params
      params.require(:component).permit(
        :name, 
        :product_id, 
        :description, 
        :active
      )
    end
end