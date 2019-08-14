module Audiobooks
	CMD = [
		:unknown,
		:play,
		:stop,
		:status,
		:seek,
		:volume
	]

	ACTION_STOPPED = 1
	ACTION_MOVED = 2

	class Handler
		def initialize(device, user)
			@device, @user = device, user
		end

		def unknown(args)
			puts "AB-handler: unknown #{args}"

			{ error: "unknown command #{args[:id]}" }
		end

		def play(args)
			puts "AB-handler: play #{args}"

			book = Audiobook.find(args[:message])
			bm = Bookmark.where(desc: [nil, ''], user: @user, audiobook: book).first
			@device.play(book, @user)
			@device.seek(book.translate(bm.value)) if bm
			{ }
		end

		def stop(args)
			puts "AB-handler: stop #{args}"

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
			puts "AB-handler: status #{args}"

			if @device.playing? and (book = @device.playing).is_a? Audiobook
				if @device.done?
					@device.stop
					{ action: ACTION_STOPPED }
				else
					{ status: {
						running: true,
						display: pretty_status(book, book.progress_of(@device.progress)),
						volume: @device.volume
					} }
				end
			else
				book = Audiobook.find(args[:message])
				{ status: {
					running: false,
					display: pretty_status(book, book.left_off(@user)),
					volume: @device.volume
				} }
			end
		end

		def seek(args)
			puts "AB-handler: seek #{args}"

			if (s = args[:message])
				book, pos = s[:book_id], s[:seek]

				listening = @device.playing? and @device.playing.is_a? Audiobook

				if listening
					book = @device.playing
					p = book.progress_of(@device.progress)
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

				if listening
					@device.seek(book.translate(pos))
				else
					book.on_stop(@user, pos)
				end
			end
			{ }
		end

		def volume(args)
			puts "AB-handler: volume #{args}"

			@device.volume args[:message].to_i
			{ }
		end
	end

	def self.execute(params, device, user)
		if device.nil? or (device.playing? and (device.user and device.user != user))
			{ action: ACTION_MOVED }
		else
			args = Helper::symbolized_hash(params)
			Handler.new(device, user).send(CMD[args[:id].to_i], args)
		end
	end
end

