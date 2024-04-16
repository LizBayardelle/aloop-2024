class ProductsController < ApplicationController
  before_action :set_product, only: %i[ show update destroy ]


  def index
    @products = Product.all
    @new_order_item = OrderItem.new
  end


  def show
    @new_order_item = OrderItem.new
  end


  def create
    @product = Product.new(product_params)

    respond_to do |format|
      if @product.save
        default_component = Component.create(product_id: @product.id, name: "Default")
        default_component.save
        default_variant = Variant.create(component_id: default_component.id, name: "Default")
        default_variant.save

        format.html { redirect_to admin_products_path, notice: "Product was successfully created." }
        format.json { render :show, status: :created, location: @product }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to admin_products_path, notice: "Product was successfully updated." }
        format.json { render :show, status: :ok, location: @product }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    if OrderItem.where(product_id: @product.id).count != 0
      redirect_to admin_products_path
      flash[:notice] = "This product has previously been ordered and shouldn't be deleted.  Try marking it as not currently sold instead."
    else
      @product.destroy

      respond_to do |format|
        format.html { redirect_to admin_products_path, notice: "Product was successfully deleted." }
        format.json { head :no_content }
      end
    end
  end

  private

    def set_product
      @product = Product.find(params[:id])
    end


    def product_params
      params.require(:product).permit(
        :name,
        :price,
        :description,
        :active,

        :size,
        :application_notes,

        :meta_title,
        :meta_keywords,
        :height,
        :width,
        :depth,
        :subtitle,
        
        product_category_ids: []
      )
    end
end
