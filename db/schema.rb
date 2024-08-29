# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_08_29_145433) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bike_models", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "blog_categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "blog_categorizations", force: :cascade do |t|
    t.bigint "blog_id", null: false
    t.bigint "blog_category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blog_category_id"], name: "index_blog_categorizations_on_blog_category_id"
    t.index ["blog_id"], name: "index_blog_categorizations_on_blog_id"
  end

  create_table "blogs", force: :cascade do |t|
    t.string "title"
    t.string "teaser"
    t.text "body"
    t.boolean "published"
    t.date "published_at"
    t.string "video_url"
    t.bigint "user_id", null: false
    t.string "slug"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_blogs_on_user_id"
  end

  create_table "components", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "name"
    t.text "description"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_components_on_product_id"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "product_id", null: false
    t.integer "quantity"
    t.text "specs"
    t.text "notes"
    t.decimal "total_price", precision: 8, scale: 2, default: "0.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "selected_variant_ids", default: [], array: true
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "orders", force: :cascade do |t|
    t.boolean "paid"
    t.string "token"
    t.decimal "price", precision: 10, scale: 2
    t.integer "user_id"
    t.boolean "move_to_checkout"
    t.boolean "shipping_info"
    t.string "address_line_1"
    t.string "address_line_2"
    t.string "city"
    t.string "state"
    t.string "postal_code"
    t.string "country"
    t.string "ship_to_name"
    t.boolean "shipping_chosen"
    t.string "shipping_choice"
    t.string "shipping_choice_img"
    t.string "customer_email"
    t.decimal "final_price", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "paypal_order_id"
    t.string "paypal_payer_id"
    t.string "paypal_payer_email"
    t.string "paypal_payment_status"
    t.string "paypal_transaction_id"
    t.string "order_status"
    t.decimal "shipping_cost", precision: 10, scale: 2
    t.datetime "paid_at"
    t.string "shipping_method_name"
    t.index ["paid_at"], name: "index_orders_on_paid_at"
  end

  create_table "photos", force: :cascade do |t|
    t.string "kit"
    t.boolean "approved", default: true
    t.text "comments"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "product_categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "product_categorizations", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.bigint "product_category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_category_id"], name: "index_product_categorizations_on_product_category_id"
    t.index ["product_id"], name: "index_product_categorizations_on_product_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "active", default: true
    t.string "meta_title"
    t.string "meta_keywords"
    t.integer "height"
    t.integer "width"
    t.integer "depth"
    t.string "subtitle"
    t.decimal "price", precision: 8, scale: 2, default: "0.0"
    t.string "size"
    t.string "application_notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "first_name"
    t.string "last_name"
    t.string "phone"
    t.boolean "admin"
    t.integer "initial_order"
    t.string "job_title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "variant_models", force: :cascade do |t|
    t.bigint "variant_id", null: false
    t.bigint "bike_model_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bike_model_id"], name: "index_variant_models_on_bike_model_id"
    t.index ["variant_id"], name: "index_variant_models_on_variant_id"
  end

  create_table "variants", force: :cascade do |t|
    t.bigint "component_id", null: false
    t.string "name"
    t.text "description"
    t.decimal "price", precision: 8, scale: 2, default: "0.0"
    t.boolean "active", default: true
    t.string "sku"
    t.string "vendor"
    t.string "vendor_parts_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["component_id"], name: "index_variants_on_component_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "blog_categorizations", "blog_categories"
  add_foreign_key "blog_categorizations", "blogs"
  add_foreign_key "blogs", "users"
  add_foreign_key "components", "products"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "products"
  add_foreign_key "product_categorizations", "product_categories"
  add_foreign_key "product_categorizations", "products"
  add_foreign_key "variant_models", "bike_models"
  add_foreign_key "variant_models", "variants"
  add_foreign_key "variants", "components"
end
