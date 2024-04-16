class CreateVariants < ActiveRecord::Migration[7.1]
  def change
    create_table :variants do |t|
      t.references :component, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.decimal :price, precision: 8, scale: 2, default: "0.0"
      t.boolean :active
      t.string :sku
      t.string :vendor
      t.string :vendor_parts_number

      t.timestamps
    end
  end
end
