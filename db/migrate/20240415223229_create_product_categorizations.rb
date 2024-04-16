class CreateProductCategorizations < ActiveRecord::Migration[7.1]
  def change
    create_table :product_categorizations do |t|
      t.references :product, null: false, foreign_key: true
      t.references :product_category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
