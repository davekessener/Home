module Audiobooks
	CMD = [
		:unknown,
		:play,
		:stop,
		:status
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

		def status(args)
			if @device.playing?
				if @device.done?
					@device.stop
					{ action: ACTION_STOPPED }
				else
					book, p = @device.playing, @device.progress
					{ status: {
						running: true,
						display: "<p>#{book.pretty(p)}</p>" +
							"<p>#{Helper::to_s(p)}/#{Helper::to_s(book.duration)}</p>"
					} }
				end
			else
				book = Audiobook.find(args[:message])
				{ status: {
					running: false,
					display: book.title
				} }
			end
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

