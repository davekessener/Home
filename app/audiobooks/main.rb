module Audiobooks
	ERROR_NO_DEVICE = 0
	ERROR_NO_BOOK = 1
	ERROR_NOT_PLAYING = 2
	ERROR_UNREACHABLE = 3
	ERROR_MOVED = 4
	
	STATUS_PLAYING = 0
	STATUS_STOPPED = 1

	def self.play(user, player, book, bookmark)
		if player.nil?
			{ error: ERROR_NO_DEVICE }
		elsif book.nil?
			{ error: ERROR_NO_BOOK }
		elsif not player.reachable?
			player.stop if player.playing?
			{ error: ERROR_UNREACHABLE }
		else
			bm = Bookmark.where(desc: [nil, ''], user: user, audiobook: book).first
			bm = Bookmark.find(bookmark.to_i) if bookmark

			player.play(book, user)
			player.seek(bm.value) if bm

			@status = Audiobooks::query_status

			nil
		end
	end

	def self.stop(player)
		if player.nil?
			{ error: ERROR_NO_DEVICE }
		elsif not player.playing?
			{ error: ERROR_NOT_PLAYING }
		else
			@status = Audiobooks::default_status

			player.stop

			{ }.to_json
		end
	end

	def self.status(player, user, book_id)
		(@status ||= Audiobooks::default_status).call(player, user, book_id)
	end

	def self.default_status
		lambda { |p, u, id| { id: STATUS_STOPPED } }
		lambda do |p, u, id|
			if p.playing? and (p.user != u or p.playing.id != id)
				{ error: ERROR_MOVED }
			else
				{ status: { id: STATUS_STOPPED } }
			end
		end
	end

	def self.query_status
		lambda do |player, user, book_id|
			book, p = player.playing, player.progress.to_i

			if not book
#				pass
			elsif player.playing? and (player.user != user or book.id != book_id)
				@status = Audiobooks::default_status
				return { error: ERROR_MOVED }
			elsif player.done?
				player.stop if player.playing?
			else
				return { status: {
					id: STATUS_PLAYING,
					playing: book.pretty(p),
					progress: p,
					progress_fmt: "#{Helper::to_s(p)} / #{Helper::to_s(book.duration)}"
				} }
			end

			@status = Audiobooks::default_status
			{ status: { id: STATUS_STOPPED } }
		end
	end
end

