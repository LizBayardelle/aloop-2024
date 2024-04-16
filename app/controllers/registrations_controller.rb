class RegistrationsController < Devise::RegistrationsController


	def create
		super
		if params[:initial_order]
			order = Order.find(params[:initial_order])
			order.user_id == @user.id
			order.save
		end
	end


	private

	def sign_up_params
		params.require(:user).permit(
			:email,
			:admin,

			:password,
			:password_confirmation,

			:first_name,
			:last_name,
	        :image,
	        :job_title,
			:phone,
			:initial_order
		)
	end



	def account_update_params
		params.require(:user).permit(
			:email,
			:admin,

			:password,
			:password_confirmation,
			:current_password,

			:first_name,
			:last_name,
	        :image,
	        :job_title,
			:phone,
			:initial_order
		)
	end
end