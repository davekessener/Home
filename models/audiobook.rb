class Audiobook < ActiveRecord::Base
	belongs_to :franchise
	has_many :chapters, dependent: :destroy
	has_many :bookmarks, dependent: :destroy
	validates_presence_of :title, :duration, :franchise_id
	validates :idx, presence: true, uniqueness: { scope: [:franchise] }

	def files
		@files ||= (0...chapter_count).map do |i|
			"audiobooks/#{franchise.path}/part_#{'%02d' % idx}_#{'%02d' % i}.mp3"
		end.sort
	end

	def pretty(progress)
		progress = progress_of(progress) if progress.is_a? Hash
		a, idx = *index_of(progress)
		ch = "#{$language['audiobooks:chapter']} #{idx}#{" - #{a[idx - 1].title}" unless a[idx - 1].title.blank?}"
		"#{title}: #{ch}"
	end

	def chapter_count
		@cCh ||= chapters.length
	end

	def on_stop(user, progress)
		progress = progress_of(progress) if progress.is_a? Hash
		last_bookmarks(user).destroy_all
		Bookmark.create(user: user, audiobook: self, value: progress) if progress < (duration - 10).to_i
	end

	def progress_of(p)
		a = chapters.order(value: :asc).to_a
		a[p[:song]].value + p[:elapsed]
	end

	def translate(p)
		a, idx = *index_of(p)
		{ song: idx - 1, elapsed: p - a[idx - 1].value }
	end

	def left_off(user)
		last_bookmarks(user).first.to_i
	end

	def last_bookmarks(user)
		Bookmark.where(desc: ['', nil], user: user, audiobook: self)
	end

	private

	def index_of(p)
		a = chapters.order(value: :asc).to_a
		[a, (a.index { |e| e.value > p }) || a.length]
	end
end

