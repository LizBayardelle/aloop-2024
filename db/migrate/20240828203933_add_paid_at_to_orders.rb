class AddPaidAtToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :paid_at, :datetime
    add_index :orders, :paid_at
  end
end