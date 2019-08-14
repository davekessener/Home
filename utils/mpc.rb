require 'socket'

require_relative 'helper'

module MPC
	class Client
		attr_reader :ip, :port
	
		def initialize(ip, port)
			@ip, @port = ip, port
		end
	
		def reachable?
			Connection.open(@ip, @port) { |c| }
		end

		def execute(cmd)
			Connection.open(@ip, @port) { |c| c.execute cmd }
		end

		def seek(idx, t)
			execute "seek #{idx} #{t}"
		end
	
		def play(files, **opts)
			opts = {
				random: 0,
				repeat: 0
			}.merge(opts)
			Connection.open(@ip, @port) do |c|
				c.execute do |list|
					list << 'clear'
					opts.each do |opt, v|
						list << "#{opt} #{v}"
					end
					files.each do |f|
						list << "add \"#{f}\""
					end
					list << 'play'
				end
			end
		end
	
		def stop
			execute 'clear'
		end
	
		def status
			@status = {}
			Connection.open(@ip, @port) do |c|
				@status = c.execute('status')
			end while @status.empty?
			puts "mpc status is #{@status}"
			@status
		end
	
		def progress
			@status['elapsed'].to_i if status['state'] == 'play'
		end
	
		def set_volume(v)
			execute "setvol #{v}"
		end
	
		def get_volume
			status['volume'].to_i
		end
	end
end

