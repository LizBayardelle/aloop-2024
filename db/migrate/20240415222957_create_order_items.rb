class CreateOrderItems < ActiveRecord::Migration[7.1]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :quantity
      t.text :specs
      t.text :notes
      t.decimal :total_price, precision: 8, scale: 2, default: "0.0"

      t.timestamps
    end
  end
end
