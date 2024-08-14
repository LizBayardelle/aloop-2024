Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
 
  root 'home#index'
  
  devise_for :users, :controllers => { registrations: 'registrations' }
  resources :users, only: [:show]
  post "users/:id/authorize_user" => "users#authorize_user", as: "authorize_user"

  get 'admin/dashboard'
  get 'admin/users'
  get 'admin/sales'
  get 'admin/blog'
  get 'admin/products'

  resources :products
  resources :product_categories
  resources :variants
  resources :components
  
  resources :orders
  resources :order_items
  post "orders/:id/mark_order_paid" => "orders#mark_order_paid", as: "mark_order_paid"

  resources :bike_models
  resources :variant_models

  resources :blogs
  resources :blog_categories

  resources :photos
  post "photos/:id/approve_photo" => "photos#approve_photo", as: "approve_photo"



  namespace :api do
    namespace :v1 do
      resources :products
      resources :components
      resources :variants
      resources :product_categories, only: [:index]
      resources :bike_models, only: [:index]
    end
  end



end