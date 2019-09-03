class AddMusic < ActiveRecord::Migration[5.1]
	def change
		create_table :genres do |t|
			t.string :name

			t.timestamps
		end

		create_table :songs do |t|
			t.string :name
			t.string :interpret
			t.integer :release
			t.integer :length

			t.belongs_to :user, index: true
			t.belongs_to :genre, index: true

			t.timestamps
		end

		create_table :playlists do |t|
			t.string :name

			t.belongs_to :user, index: true

			t.timestamps
		end

		create_table :playlists_songs, id: false do |t|
			t.belongs_to :song, index: true
			t.belongs_to :playlist, index: true
		end
	end
end
