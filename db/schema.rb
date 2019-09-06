# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190904131934) do

  create_table "activities", force: :cascade do |t|
    t.string "content"
    t.datetime "due"
    t.boolean "important", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "activities_users", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "activity_id"
    t.index ["activity_id"], name: "index_activities_users_on_activity_id"
    t.index ["user_id"], name: "index_activities_users_on_user_id"
  end

  create_table "audiobooks", force: :cascade do |t|
    t.integer "franchise_id"
    t.string "title"
    t.integer "duration"
    t.integer "idx"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["franchise_id"], name: "index_audiobooks_on_franchise_id"
  end

  create_table "base_ingredients", force: :cascade do |t|
    t.integer "ingredient_list_id"
    t.integer "ingredient_variation_id"
    t.integer "unit"
    t.float "quantity"
    t.index ["ingredient_list_id"], name: "index_base_ingredients_on_ingredient_list_id"
    t.index ["ingredient_variation_id"], name: "index_base_ingredients_on_ingredient_variation_id"
  end

  create_table "bookmarks", force: :cascade do |t|
    t.integer "user_id"
    t.integer "audiobook_id"
    t.integer "value"
    t.string "desc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["audiobook_id"], name: "index_bookmarks_on_audiobook_id"
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "chapters", force: :cascade do |t|
    t.integer "audiobook_id"
    t.time "value"
    t.string "title"
    t.index ["audiobook_id"], name: "index_chapters_on_audiobook_id"
  end

  create_table "compound_ingredients", force: :cascade do |t|
    t.integer "ingredient_list_id"
    t.integer "dish_id"
    t.integer "unit"
    t.float "quantity"
    t.index ["dish_id"], name: "index_compound_ingredients_on_dish_id"
    t.index ["ingredient_list_id"], name: "index_compound_ingredients_on_ingredient_list_id"
  end

  create_table "dishes", force: :cascade do |t|
    t.integer "ingredient_list_id"
    t.string "name"
    t.string "description"
    t.string "instructions"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "note"
    t.index ["ingredient_list_id"], name: "index_dishes_on_ingredient_list_id"
  end

  create_table "dishes_recipe_tags", id: false, force: :cascade do |t|
    t.integer "dish_id", null: false
    t.integer "recipe_tag_id", null: false
  end

  create_table "embedded_ingredients", force: :cascade do |t|
    t.integer "ingredient_list_id"
    t.integer "content_id"
    t.string "name"
    t.index ["content_id"], name: "index_embedded_ingredients_on_content_id"
    t.index ["ingredient_list_id"], name: "index_embedded_ingredients_on_ingredient_list_id"
  end

  create_table "franchises", force: :cascade do |t|
    t.string "name"
    t.string "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "genres", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ingredient_lists", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ingredient_variations", force: :cascade do |t|
    t.integer "ingredient_id"
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ingredient_id"], name: "index_ingredient_variations_on_ingredient_id"
  end

  create_table "ingredients", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "playlists", force: :cascade do |t|
    t.string "name"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_playlists_on_user_id"
  end

  create_table "playlists_songs", id: false, force: :cascade do |t|
    t.integer "song_id"
    t.integer "playlist_id"
    t.index ["playlist_id"], name: "index_playlists_songs_on_playlist_id"
    t.index ["song_id"], name: "index_playlists_songs_on_song_id"
  end

  create_table "radio_servers", force: :cascade do |t|
    t.string "name"
    t.string "url"
    t.integer "remote_idx"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "radio_stations", force: :cascade do |t|
    t.string "name"
    t.string "url"
    t.string "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "recipe_tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "songs", force: :cascade do |t|
    t.string "name"
    t.string "interpret"
    t.integer "release"
    t.integer "length"
    t.integer "user_id"
    t.integer "genre_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["genre_id"], name: "index_songs_on_genre_id"
    t.index ["user_id"], name: "index_songs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "lang", default: "de"
    t.string "last_ip"
    t.integer "last_device"
  end

end
