class VariantModelsController < ApplicationController
  before_action :set_variant_model, only: %i[ show edit update destroy ]


  def create
    @variant_model = VariantModel.new(variant_model_params)

    respond_to do |format|
      if @variant_model.save
        format.html { redirect_to admin_variants_path, notice: "Variant model was successfully created." }
        format.json { render :show, status: :created, location: @variant_model }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @variant_model.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @variant_model.update(variant_model_params)
        format.html { redirect_to admin_variants_path, notice: "Variant model was successfully updated." }
        format.json { render :show, status: :ok, location: @variant_model }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @variant_model.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @variant_model.destroy

    respond_to do |format|
      format.html { redirect_to admin_variants_path, notice: "Variant model was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

    def set_variant_model
      @variant_model = VariantModel.find(params[:id])
    end


    def variant_model_params
      params.require(:variant_model).permit(
        :name,
        variant_ids: [],
        bike_model_ids: []
      )
    end
end
