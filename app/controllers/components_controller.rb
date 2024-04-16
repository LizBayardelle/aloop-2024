class ComponentsController < ApplicationController
  before_action :set_component, only: %i[ update destroy ]

  def create
    @component = Component.new(component_params)

    respond_to do |format|
      if @component.save
        format.html { redirect_to admin_products_path, notice: "Product component was successfully created." }
        format.json { render :show, status: :created, location: @component }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @component.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @component.update(component_params)
        format.html { redirect_to admin_products_path, notice: "Product component was successfully updated." }
        format.json { render :show, status: :ok, location: @component }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @component.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    if OrderItem.where(product_id: @component.product.id).count != 0
      redirect_to admin_products_path
      flash[:notice] = "This component has previously been ordered and shouldn't be deleted.  Try marking it as not currently sold instead."
    else
      @component.destroy

      respond_to do |format|
        format.html { redirect_to admin_products_path, notice: "Product component was successfully deleted." }
        format.json { head :no_content }
      end
    end
  end

  private

    def set_component
      @component = Component.find(params[:id])
    end


    def component_params
      params.require(:component).permit(
        :product_id,
        :name,
        :description,
        :active
      )
    end
end
