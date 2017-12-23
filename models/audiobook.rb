class Audiobook < ActiveRecord::Base
	belongs_to :franchise
	has_many :chapters, dependent: :destroy
	has_many :bookmarks, dependent: :destroy
	validates_presence_of :title, :duration, :franchise_id
	validates :idx, presence: true, uniqueness: { scope: [:franchise] }

	def file_path
		"audiobooks/#{franchise.path}/part#{'%02d' % idx}.mp3"
	end

	def pretty(progress)
		a = chapters.order(value: :asc).to_a
		idx = (a.index { |e| e.value > progress.to_i }) || a.length
		ch = "#{$language['audiobooks:chapter']} #{idx} - #{a[idx - 1].title}"
		"#{title}: #{ch}"
	end

	def chapter_count
		@cCh ||= chapters.length
	end

	def on_stop(user, progress)
		if progress
			last_bookmarks(user).destroy_all
			Bookmark.create(user: user, audiobook: self, value: progress) if progress < (duration - 10).to_i
		end
	end

	def left_off(user)
		last_bookmarks(user).first.to_i
	end

	def last_bookmarks(user)
		Bookmark.where(desc: ['', nil], user: user, audiobook: self)
	end
end

