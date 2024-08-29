class AddShippingMethodNameToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :shipping_method_name, :string
  end
end
