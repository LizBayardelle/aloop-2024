class BikeModelsController < ApplicationController
  before_action :set_bike_model, only: %i[ update destroy ]

  def create
    @bike_model = BikeModel.new(bike_model_params)

    respond_to do |format|
      if @bike_model.save
        format.html { redirect_to admin_products_path, notice: "That model was successfully created." }
        format.json { render :show, status: :created, location: @bike_model }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @bike_model.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @bike_model.update(bike_model_params)
        format.html { redirect_to admin_products_path, notice: "That model was successfully updated." }
        format.json { render :show, status: :ok, location: @bike_model }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @bike_model.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @bike_model.destroy

    respond_to do |format|
      format.html { redirect_to admin_products_path, notice: "Poof!  It's gone." }
      format.json { head :no_content }
    end
  end

  private

    def set_bike_model
      @bike_model = BikeModel.find(params[:id])
    end


    def bike_model_params
      params.require(:bike_model).permit(:name)
    end
end
