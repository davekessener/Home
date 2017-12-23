module Audiobooks
	CMD = [
		:unknown,
		:play,
		:stop,
		:status,
		:seek
	]

	ACTION_STOPPED = 1
	ACTION_MOVED = 2

	class Handler
		def initialize(device, user)
			@device, @user = device, user
		end

		def unknown(args)
			{ error: "unknown command #{args[:id]}" }
		end

		def play(args)
			book = Audiobook.find(args[:message])
			bm = Bookmark.where(desc: [nil, ''], user: @user, audiobook: book).first
			@device.play(book, @user)
			@device.seek(bm.value) if bm
			{ }
		end

		def stop(args)
			if @device.playing?
				@device.stop
				{ action: ACTION_STOPPED }
			else
				{ }
			end
		end

		def pretty_status(book, p)
			"<p>#{book.pretty(p)}</p><p>#{Helper::to_s(p)}/#{Helper::to_s(book.duration)}</p>"
		end

		def status(args)
			if @device.playing?
				if @device.done?
					@device.stop
					{ action: ACTION_STOPPED }
				else
					book, p = @device.playing, @device.progress
					{ status: {
						running: true,
						display: pretty_status(book, p)
					} }
				end
			else
				book = Audiobook.find(args[:message])
				{ status: {
					running: false,
					display: pretty_status(book, book.left_off(@user))
				} }
			end
		end

		def seek(args)
			if (s = args[:message])
				book, pos = s[:book_id], s[:seek]

				if @device.playing?
					book = @device.playing
					p = @device.progress || book.left_off(@user)
				else
					book = Audiobook.find(book.to_i)
					p = book.left_off(@user)
				end

				if pos[0] == '+'
					pos = p + Helper::convert(pos[1..-1])
				elsif pos[0] == '-'
					pos = p - Helper::convert(pos[1..-1])
				else
					pos = Helper::convert(pos)
				end

				pos = [[0, pos].max, book.duration - 1].min

				if @device.playing?
					@device.seek(pos)
				else
					book.on_stop(@user, pos)
				end
			end
			{ }
		end
	end

	def self.execute(params, device, user)
		if device.nil? or (device.playing? and device.user != user)
			{ action: ACTION_MOVED }
		else
			args = Helper::symbolized_hash(params)
			Handler.new(device, user).send(CMD[args[:id].to_i], args)
		end
	end
end

