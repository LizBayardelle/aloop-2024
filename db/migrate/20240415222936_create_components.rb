class CreateComponents < ActiveRecord::Migration[7.1]
  def change
    create_table :components do |t|
      t.references :product, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.boolean :active

      t.timestamps
    end
  end
end
