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
  end

  def blog
    @blogs = Blog.order("created_at DESC").all
  end

  def order_detail
    @order = Order.includes(order_items: :product).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to admin_sales_path, alert: "Order not found"
  end

  def mark_order_shipped
    @order = Order.find(params[:id])
    @order.update(order_status: 'shipped')
    OrderMailer.shipping_notification(@order).deliver_now
    redirect_to admin_order_path(@order), notice: "Order marked as shipped and customer notification sent"
  rescue ActiveRecord::RecordNotFound
    redirect_to admin_sales_path, alert: "Order not found"
  end

end
