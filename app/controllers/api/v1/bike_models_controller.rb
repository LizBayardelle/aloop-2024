class Api::V1::BikeModelsController < ApplicationController
    def index
        @bike_models = BikeModel.all
        render json: @bike_models
    end
end