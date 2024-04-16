class BlogSubcategoriesController < ApplicationController
  before_action :set_blog_subcategory, only: %i[ show edit update destroy ]


  def show
  end


  def create
    @blog_subcategory = BlogSubcategory.new(blog_subcategory_params)

    respond_to do |format|
      if @blog_subcategory.save
        format.html { redirect_to admin_blog_path, notice: "Blog subcategory was successfully created." }
        format.json { render :show, status: :created, location: @blog_subcategory }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @blog_subcategory.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @blog_subcategory.update(blog_subcategory_params)
        format.html { redirect_to admin_blog_path, notice: "Blog subcategory was successfully updated." }
        format.json { render :show, status: :ok, location: @blog_subcategory }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @blog_subcategory.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @blog_subcategory.destroy

    respond_to do |format|
      format.html { redirect_to admin_blog_path, notice: "Blog subcategory was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

    def set_blog_subcategory
      @blog_subcategory = BlogSubcategory.find(params[:id])
    end


    def blog_subcategory_params
      params.require(:blog_subcategory).permit(
        :name
      )
    end
end
