class AddIndexToPhotosApproved < ActiveRecord::Migration[7.1]
  def change
    add_index :photos, :approved
  end
end
