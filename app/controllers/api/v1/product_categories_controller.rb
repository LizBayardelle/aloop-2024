class Api::V1::ProductCategoriesController < ApplicationController
    def index
        @product_categories = ProductCategory.all
        render json: @product_categories
    end
end