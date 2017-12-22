require_relative 'lib'
require_relative 'mpc'

class MediaPlayer
	ServerInfo = {
		ip: '192.168.1.29',
		service: 6600,
		http: 8000
	}.to_o

	attr_reader :playing, :user

	def initialize(device)
		@device = device
		@server = MPC.new(ServerInfo.ip, ServerInfo.service + device.remote_idx)
		@client = MPC.new(device.url, ServerInfo.service)
		@stream = "http://#{ServerInfo.ip}:#{ServerInfo.http + device.remote_idx}/"
	end

	def playing?
		@playing
	end

	def done?
		(not playing?) or (@progress and @server.progress.nil?)
	end

	def reachable?
		if @check.nil? or (t = Time.current) - @check > 2
			@check = t
			return false unless Helper::is_server_reachable(@client.ip)
			return false unless Helper::is_server_reachable(@server.ip)
		end
		true
	end

	def play(obj, user = nil)
		raise unless reachable?
		stop if playing?
		@server.play(obj.file_path)
		@client.play(@stream)
		@playing, @user = obj, user
	end

	def stop
		@playing.on_stop(@user, progress) if @user
		if reachable?
			@client.stop
			@server.stop
		end
		@progress = @playing = @user= nil
	end

	def seek(t)
		raise unless reachable?
		@server.execute "seek #{Helper::to_s(t)}"
	end

	def progress
		raise unless reachable?
		@progress = @server.progress || @progress
	end

	def self.by_device(device)
		@@players ||= {}
		@@players[device.id] = new(device) unless @@players[device.id]
		@@players[device.id]
	end

	private_class_method :new
end

