class VariantModel < ApplicationRecord
  belongs_to :variant
  belongs_to :bike_model
end
