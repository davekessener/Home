class CreateAudiobooks < ActiveRecord::Migration[5.1]
	def change
		create_table :franchises do |t|
			t.string :name
			t.string :path

			t.timestamps
		end

		create_table :audiobooks do |t|
			t.belongs_to :franchise, index: true
			t.string :title
			t.integer :duration
			t.integer :idx

			t.timestamps
		end

		create_table :chapters do |t|
			t.belongs_to :audiobook, index: true
			t.time :value
			t.string :title
		end

		create_table :bookmarks do |t|
			t.belongs_to :user, index: true
			t.belongs_to :audiobook, index: true
			t.integer :value
			t.string :desc, null: true

			t.timestamps
		end
	end
end
