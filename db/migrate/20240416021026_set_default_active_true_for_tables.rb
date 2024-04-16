class SetDefaultActiveTrueForTables < ActiveRecord::Migration[7.1]
  def up
    change_column_default :products, :active, from: nil, to: true
    change_column_default :variants, :active, from: nil, to: true
    change_column_default :components, :active, from: nil, to: true
  end

  def down
    change_column_default :products, :active, from: true, to: nil
    change_column_default :variants, :active, from: true, to: nil
    change_column_default :components, :active, from: true, to: nil
  end
end

