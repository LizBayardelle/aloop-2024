class UsersController < ApplicationController
  before_action :set_user, only: %i[ show ]

  def show
    @new_order_item = OrderItem.new
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
