class CreatePhotos < ActiveRecord::Migration[7.1]
  def change
    create_table :photos do |t|
      t.string :kit
      t.boolean :approved
      t.text :comments

      t.timestamps
    end
  end
end
