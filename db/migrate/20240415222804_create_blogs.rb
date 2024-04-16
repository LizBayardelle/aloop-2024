class CreateBlogs < ActiveRecord::Migration[7.1]
  def change
    create_table :blogs do |t|
      t.string :title
      t.string :teaser
      t.text :body
      t.boolean :published
      t.date :published_at
      t.string :video_url
      t.references :user, null: false, foreign_key: true
      t.string :slug
      t.string :image_url

      t.timestamps
    end
  end
end
