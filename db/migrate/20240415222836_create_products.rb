class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.boolean :active
      t.string :meta_title
      t.string :meta_keywords
      t.integer :height
      t.integer :width
      t.integer :depth
      t.string :subtitle
      t.decimal :price, precision: 8, scale: 2, default: "0.0"
      t.string :size
      t.string :application_notes

      t.timestamps
    end
  end
end
