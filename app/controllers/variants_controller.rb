class VariantsController < ApplicationController
  before_action :set_variant, only: %i[ update destroy ]


  def create
    @variant = Variant.new(variant_params)

    respond_to do |format|
      if @variant.save
        format.html { redirect_to admin_products_path, notice: "Variant was successfully created." }
        format.json { render :show, status: :created, location: @variant }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @variant.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @variant.update(variant_params)
        format.html { redirect_to admin_products_path, notice: "Variant was successfully updated." }
        format.json { render :show, status: :ok, location: @variant }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @variant.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @variant.destroy

    respond_to do |format|
      format.html { redirect_to admin_products_path, notice: "Variant was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def set_variant
      @variant = Variant.find(params[:id])
    end

    def variant_params
      params.require(:variant).permit(
        :component_id, 
        :name, 
        :description, 
        :price,

        :sku,
        :vendor,
        :vendor_parts_number,
        
        :active,
        photos: [],
        bike_model_ids: []
      )
    end
end
