module Music
	class Genre < ActiveRecord::Base
		validates :name, uniqueness: true, presence: true
		has_many :songs
	end

	class Song < ActiveRecord::Base
		belongs_to :genre
		belongs_to :user
		has_and_belongs_to_many :playlists

		validates :name, presence: true
		validates :user_id, presence: true

		def filename
			"song_#{'%03d' % id}.mp3"
		end
	end

	class Playlist < ActiveRecord::Base
		belongs_to :user
		has_and_belongs_to_many :songs

		validates :name, presence: true
		validates :user_id, presence: true
	end
end

