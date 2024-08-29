class UpdateOrdersTable < ActiveRecord::Migration[7.1]
  def up
    # Add new columns
    add_column :orders, :paypal_order_id, :string
    add_column :orders, :paypal_payer_id, :string
    add_column :orders, :paypal_payer_email, :string
    add_column :orders, :paypal_payment_status, :string
    add_column :orders, :paypal_transaction_id, :string
    add_column :orders, :order_status, :string

    # Change price and final_price to decimal
    change_column :orders, :price, :decimal, precision: 10, scale: 2, using: 'price::numeric'
    change_column :orders, :final_price, :decimal, precision: 10, scale: 2, using: 'final_price::numeric'

    # Handle shipping_price conversion
    add_column :orders, :shipping_cost, :decimal, precision: 10, scale: 2

    # Copy data from shipping_price to shipping_cost, handling potential non-numeric values
    execute <<-SQL
      UPDATE orders 
      SET shipping_cost = CASE 
        WHEN shipping_price ~ '^[0-9]+(\.[0-9]+)?$' THEN shipping_price::numeric 
        ELSE 0 
      END
    SQL

    # Remove old shipping_price column
    remove_column :orders, :shipping_price
  end

  def down
    # Revert changes if needed
    remove_column :orders, :paypal_order_id
    remove_column :orders, :paypal_payer_id
    remove_column :orders, :paypal_payer_email
    remove_column :orders, :paypal_payment_status
    remove_column :orders, :paypal_transaction_id
    remove_column :orders, :order_status

    change_column :orders, :price, :string
    change_column :orders, :final_price, :string

    add_column :orders, :shipping_price, :string
    execute "UPDATE orders SET shipping_price = shipping_cost::text"
    remove_column :orders, :shipping_cost
  end
end