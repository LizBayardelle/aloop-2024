class BlogCategoriesController < ApplicationController
  before_action :set_blog_category, only: %i[ update destroy ]


  def show
  end


  def create
    @blog_category = BlogCategory.new(blog_category_params)

    respond_to do |format|
      if @blog_category.save
        format.html { redirect_to admin_blog_path, notice: "Blog category was successfully created." }
        format.json { render :show, status: :created, location: @blog_category }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @blog_category.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @blog_category.update(blog_category_params)
        format.html { redirect_to admin_blog_path, notice: "Blog category was successfully updated." }
        format.json { render :show, status: :ok, location: @blog_category }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @blog_category.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @blog_category.destroy

    respond_to do |format|
      format.html { redirect_to admin_blog_path, notice: "Blog category was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

    def set_blog_category
      @blog_category = BlogCategory.find(params[:id])
    end


    def blog_category_params
      params.require(:blog_category).permit(
        :name
      )
    end
end
