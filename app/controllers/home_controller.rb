class HomeController < ApplicationController
  def index
    @videos = Blog.where.not(video_url: "").order(created_at: :desc).limit(12)
  end
end
