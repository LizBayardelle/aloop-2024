class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:orders]
  before_action :set_user, only: %i[ show ]

  def show
    @new_order_item = OrderItem.new
  end

  def orders
    @orders = current_user.orders.where(paid: true).order(created_at: :desc)
  end

  def authorize_user
    @user = User.find(params[:id])
    if @user.update(admin: true)
        redirect_to admin_users_path
        flash[:notice] = "That user has been authorized!"
    else
        redirect_to admin_users_path
        flash[:warning] = "Oops! Something went wrong!"
    end
  end

  private

    def set_user
      @user = User.find(params[:id])
    end



end
