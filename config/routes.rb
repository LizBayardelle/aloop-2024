Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  
  root 'admin#dashboard'
  get 'admin/blog'
  get 'admin/products'
  get 'admin/sales'
  get 'admin/users'

  
end
