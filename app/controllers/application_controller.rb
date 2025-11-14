class ApplicationController < ActionController::Base
  include Pagy::Frontend
  protect_from_forgery with: :exception
  before_action :set_current_order
  before_action :set_active_storage_current_host

  private
 
  def set_active_storage_current_host
    ActiveStorage::Current.url_options = { host: request.base_url }
  end
  
  def set_current_order
    @current_order = Order.find_by(id: session[:order_id])
    if @current_order.nil?
      @current_order = Order.create!
      session[:order_id] = @current_order.id
    end
    @current_order
  end



  def admin_only
    unless current_user && current_user.admin
      if current_user.mastermind
        redirect_to team_mine_path
      else
        respond_to root_path, notice: "Sorry, you have to be an admin to do that."
      end
    end
  end

end
