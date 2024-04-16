class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.boolean :paid
      t.string :token
      t.decimal :price
      t.integer :user_id
      t.boolean :move_to_checkout
      t.boolean :shipping_info
      t.string :address_line_1
      t.string :address_line_2
      t.string :city
      t.string :state
      t.string :postal_code
      t.string :country
      t.string :ship_to_name
      t.boolean :shipping_chosen
      t.string :shipping_choice
      t.string :shipping_choice_img
      t.string :shipping_price
      t.string :customer_email
      t.decimal :final_price

      t.timestamps
    end
  end
end
