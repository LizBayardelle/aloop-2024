class BikeModel < ApplicationRecord
	has_many :variant_models
	has_many :variants, through: :variant_models
end
