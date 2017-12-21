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

ActiveRecord::Schema.define(version: 20171220164239) do

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

  create_table "franchises", force: :cascade do |t|
    t.string "name"
    t.string "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "radio_servers", force: :cascade do |t|
    t.string "name"
    t.string "url"
    t.integer "remote_idx"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "lang", default: "de"
  end

end
