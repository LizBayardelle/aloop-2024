class AddSelectedVariantIdsToOrderItems < ActiveRecord::Migration[7.1]
  def change
    add_column :order_items, :selected_variant_ids, :integer, array: true, default: []
  end
end