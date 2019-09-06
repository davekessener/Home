module Music
	CMD = [
		:unknown,
		:register,
		:pause,
		:resume,
		:status,
		:seek,
		:next,
		:prev,
		:mode
	]

	ACTION_MOVED = 1
	ACTION_STOPPED = 2

	MODE_NORMAL = 0;
	MODE_REPEAT_ONE = 1;
	MODE_REPEAT_ALL = 2;
	MODE_SHUFFLE = 3;

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
			@device.server.execute [ 'repeat 0', 'single 0', 'random 0' ]
			@device.stop

			status
		end

		def pause(args)
			@device.stop if playing?

			status
		end

		def resume(args)
			pl = @handles[@device.id]

			@device.play(pl, @user)
			@device.seek(pl.progress) if pl.progress

			status
		end

		def status(args = nil)
			pl = @handles[@device.id]

			progress_report = ->(r, p) {
				s, i = *pl.song(p[:song])

				return {
					status: {
						running: r,
						index: i,
						song: s.pretty,
						elapsed: p[:elapsed],
						total: s.length
					}
				}
			}

			if @device.playing == pl
				progress_report.(true, @device.progress)
			elsif not @device.playing? and (p = pl.progress)
				progress_report.(false, p)
			else
				{ action: ACTION_STOPPED }
			end
		end

		def seek(args)
			pl = @handles[@device.id]
			p = args[:message]

			if p.is_a? Hash
				pl.shuffle if pl.random?

				p = p.dup
				p[:song] = pl.translate(p[:song].to_i)
				p[:elapsed] = (p[:elapsed].to_f * pl.song(p[:song])[0].length).to_i
			else
				s = (playing? ? @device.progress[:song] : pl.progress[:song])
				p = { song: s, elapsed: p.to_i }
			end

			@device.play(pl, @user) unless playing?
			@device.seek(p)

			status
		end

		def next(args)
			resume(args) if not playing?
			@device.server.execute 'next'

			status
		end

		def prev(args)
			resume(args) if not playing?
			@device.server.execute 'prev'

			status
		end

		def mode(args)
			pl = @handles[@device.id]
			m = args[:message].to_i

			return { error: "unknown mode #{m}!" } if m < 0 or m > MODE_SHUFFLE

			is_playing = playing?

			@device.server.execute [ 'repeat 0', 'single 0' ]
			@device.stop if playing?

			case m
				when MODE_NORMAL
					pl.reset

				when MODE_REPEAT_ONE
					@device.server.execute [ 'repeat 1', 'single 1' ]

				when MODE_REPEAT_ALL
					@device.server.execute 'repeat 1'

				when MODE_SHUFFLE
					pl.shuffle
			end

			resume(args) if is_playing

			status
		end

		private

		def playing?
			(@device.playing? and @device.playing == @handles[@device.id])
		end
	end

	def self.execute(params, device, user)
		if device.nil? or (device.playing? and (device.user and device.user != user))
			{ action: ACTION_MOVED }
		else
			args = Helper.symbolized_hash(params)
			puts "!!! Music Player #{args}"
			Handler.new(device, user).send(CMD[args[:id].to_i], args)
		end
	end
end

