require_relative 'lib'
require_relative 'mpc'

class MediaPlayer
	ServerInfo = {
		ip: '192.168.1.19',
		service: 6600,
		http: 8000
	}.to_o

	attr_reader :playing, :user

	def initialize(device)
		@device = device
		@server = MPC::Client.new(ServerInfo.ip, ServerInfo.service + device.remote_idx)
		@client = MPC::Client.new(device.url, ServerInfo.service)
		@stream = "http://#{ServerInfo.ip}:#{ServerInfo.http + device.remote_idx}/"
	end

	def name
		@device.name
	end

	def playing?
		@playing
	end

	def done?
		@server.status['state'] != 'play'
	end

	def reachable?
		if @check.nil? or (t = Time.current) - @check > 2
			@check = t
			(@client.reachable? and @server.reachable?)
		end
		true
	end

	def play(obj, user = nil)
		raise unless reachable?
		stop if playing?
		@server.play(obj.files)
		@client.play([@stream])
		@playing, @user = obj, user
	end

	def play_local(obj, user = nil)
		raise unless reachable?
		stop if playing?
		@client.play(obj.files)
		@playing, @user = obj, user
	end

	def stop
		@playing.on_stop(@user, progress) if @user
		@client.stop
		@server.stop
		@progress = @playing = @user= nil
	end

	def seek(pos)
		raise unless reachable?
		if pos.is_a? Hash
			@server.execute "seek #{pos[:song]} #{pos[:elapsed]}"
		else
			@server.execute "seekcur #{pos.to_i}"
		end
	end

	def progress
		raise unless reachable?
		if (s = @server.status)['state'] == 'play'
			@progress = {
				song: s['song'].to_i,
				elapsed: s['elapsed'].to_i
			}
			@client.execute 'play'
		end
		(@progress || no_progress)
	end

	def volume(v = nil)
		if v
			@client.set_volume v
			v
		else
			@client.get_volume
		end
	end

	def self.by_device(device)
		@@players ||= {}
		@@players[device.id] = new(device) unless @@players[device.id]
		@@players[device.id]
	end

	private_class_method :new

	private

	def no_progress
		@@no_prog ||= { song: 0, elapsed: 0 }
	end
end

