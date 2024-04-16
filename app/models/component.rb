class Component < ApplicationRecord
  belongs_to :product
  has_many :variants, dependent: :destroy
end
