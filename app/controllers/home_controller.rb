class HomeController < ApplicationController
  def index
    @latest_blog = Blog.where(published: true).order("created_at DESC").limit(1).first
    @videos = Blog.where.not(video_url: "").limit(12)
  end
end
