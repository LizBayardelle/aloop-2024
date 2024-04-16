class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable

  # ATTACHMENTS
  has_one_attached :image


  # RELATIONSHIPS
  has_many :orders
  has_many :blogs


  # MODELS

  def full_name
    "#{first_name} #{last_name}"
  end

end
