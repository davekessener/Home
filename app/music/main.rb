module Music
	CMD = [
		:unknown,
		:register,
		:pause,
		:resume,
		:status
	]

	ACTION_MOVED = 1
	ACTION_STOPPED = 2

	class Handler
		def initialize(device, user)
			@device, @user = device, user

			@@handles ||= {}
			@handles = (@@handles[user.id] ||= {})
		end

		def unknown(args)
			{ error: "unknown command #{args[:id]}" }
		end

		def register(args)
			pid = args[:message][:playlist].to_i
			pl = Play.new(Playlist.find(pid))
			
			@handles[@device.id] = pl

			{ }
		end

		def pause(args)
			@device.stop if @device.playing? and @device.playing == @handles[@device.id]

			{ }
		end

		def resume(args)
			pl = @handles[@device.id]

			@device.play(pl, @user)
			@device.seek(pl.progress) if pl.progress

			{ }
		end

		def status(args)
			pl = @handles[@device.id]

			if @device.playing? and @device.playing == pl
				p = @device.progress
				s = pl.song(p[:song])

				{
					status: {
						running: true,
						song: s.name,
						elapsed: p[:elapsed],
						total: s.length
					}
				}
			else
				{ action: ACTION_STOPPED }
			end
		end
	end

	def self.execute(params, device, user)
		if device.nil? or (device.playing? and (device.user and device.user != user))
			{ action: ACTION_MOVED }
		else
			args = Helper.symbolized_hash(params)
			Handler.new(device, user).send(CMD[args[:id].to_i], args)
		end
	end
end

