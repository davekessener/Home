class Audiobook < ActiveRecord::Base
	belongs_to :franchise
	has_many :chapters, dependent: :destroy
	has_many :bookmarks, dependent: :destroy
	validates_presence_of :title, :duration, :franchise_id
	validates :idx, presence: true, uniqueness: true

	def file_path
		"audiobooks/#{franchise.path}/part#{'%02d' % idx}.mp3"
	end

	def pretty(progress)
		a = chapters.to_a.sort { |e1, e2| e1.value - e2.value }
		ch = 'ERROR'
		if (idx = a.index { |e| e.value > progress })
			ch = "Chapter #{idx} - #{a[idx - 1].title}"
		end
		"#{title}: #{ch}"
	end

	def on_stop(user, progress)
		Bookmark.where(desc: ['', nil], user: user).destroy_all
		Bookmark.create(user: user, audiobook: self, value: progress) if progress < (duration - 10).to_i
	end
end

