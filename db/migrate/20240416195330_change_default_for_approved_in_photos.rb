class ChangeDefaultForApprovedInPhotos < ActiveRecord::Migration[7.1]
  def change
    change_column_default :photos, :approved, from: nil, to: true
  end
end
