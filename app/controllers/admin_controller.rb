class AdminController < ApplicationController
  before_action :admin_only
  
  def dashboard
  end
  
  def products
    @products = Product.order("created_at ASC").all
  end

  def users
    @users = User.order("created_at ASC").all
  end

  def sales
    @orders = Order.includes(:order_items).order(created_at: :desc)
  end

  def blog
    @blogs = Blog.order("created_at DESC").all
  end
end
