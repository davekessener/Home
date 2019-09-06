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
		validates :length, presence: true

		def filename
			"song_#{'%03d' % id}.mp3"
		end

		def pretty
			s = name
			s = "#{interpret} - #{s}" if (interpret and not interpret.empty?)
			s = "#{s} (#{release})" if release
			s
		end
	end

	class Playlist < ActiveRecord::Base
		belongs_to :user
		has_and_belongs_to_many :songs

		validates :name, presence: true
		validates :user_id, presence: true
	end

	class Play
		attr_reader :files, :id, :progress

		def initialize(pl)
			@playlist = pl
			@id = generate_id

			reset
		end

		def random?
			@random
		end

		def song(i)
			@base[i]
		end

		def on_stop(user, progress)
			@progress = progress
		end

		def shuffle
			idx = @base[@progress[:song]][1] if @progress

			@base.shuffle!
			@random = true

			@progress[:song] = translate(idx) if @progress

			update
		end

		def reset
			idx = @base[@progress[:song]][1] if @progress

			@base = @playlist.songs.to_a.each_with_index.map { |e, i| [e, i] }
			@random = false

			@progress[:song] = idx if @progress

			update
		end

		def translate(i)
			@base.index { |e, j| i == j }
		end

		private

		def update
			@files = @base.map { |s, i| Storage.path('songs', s.filename) }
		end

		def generate_id
			v = rand
			v = 1 - v * v
			d = Time.now.to_i
			(d * v).to_i
		end
	end
end

