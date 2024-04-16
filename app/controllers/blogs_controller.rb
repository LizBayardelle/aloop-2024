class BlogsController < ApplicationController
  before_action :set_blog, only: %i[ show update destroy ]


  def index
    @blogs = Blog.where(published: true)
  end


  def show
  end


  def create
    @blog = Blog.new(blog_params)

    respond_to do |format|
      if @blog.save
        format.html { redirect_to admin_blog_path, notice: "Bam!  It exists." }
        format.json { render :show, status: :created, location: @blog }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @blog.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @blog.update(blog_params)
        format.html { redirect_to admin_blog_path, notice: "Blog was successfully updated." }
        format.json { render :show, status: :ok, location: @blog }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @blog.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @blog.destroy

    respond_to do |format|
      format.html { redirect_to admin_blog_path, notice: "Poof!  All gone." }
      format.json { head :no_content }
    end
  end

  private

  def set_blog
    @blog = Blog.friendly.find(params[:id])
  end


  def blog_params
    params.require(:blog).permit(
      :title,
      :teaser,
      :body,
      :published,
      :published_at,
      :video_url,
      :user_id,
      :slug,
      :image_url,
      :image,
      blog_category_ids: []
    )
  end
end
