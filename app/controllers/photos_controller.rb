class PhotosController < ApplicationController
  before_action :set_photo, only: %i[ update destroy ]


  def index
    @unapproved_photos = Photo.where(approved: false).order(created_at: :desc).limit(100) if current_user&.admin?
    @approved_photos = Photo.where(approved: true).order(created_at: :desc).limit(200)
  end


  def create
    @photo = Photo.new(photo_params)
    @photo.approved = true if current_user&.admin?
    
    respond_to do |format|
      if @photo.save
        format.html { redirect_to photos_path, notice: "Photo was successfully created." }
        format.json { render :show, status: :created, location: @photo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @photo.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @photo.update(photo_params)
        format.html { redirect_to photos_path, notice: "Photo was successfully updated." }
        format.json { render :show, status: :ok, location: @photo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @photo.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @photo.destroy

    respond_to do |format|
      format.html { redirect_to photos_path, notice: "Photo was successfully destroyed." }
      format.json { head :no_content }
    end
  end


  def approve_photo
      @photo = Photo.find(params[:id])
      if @photo.update(approved: true)
          redirect_to photos_path
          flash[:notice] = "That photo has been approved!"
      else
          redirect_to photos_path
          flash[:warning] = "Oops! Something went wrong!"
      end
  end


  private

    def set_photo
      @photo = Photo.find(params[:id])
    end


    def photo_params
      params.require(:photo).permit(
        :kit,
        :approved,
        :comments,
        :image
      )
    end
end
