require_relative 'helper'

class MPC
	attr_reader :ip, :port

	def initialize(ip, port)
		@ip, @port = ip, port
	end

	def execute(cmd, *args)
		`mpc -h "#{@ip}" -p #{@port} #{cmd} #{args.join(' ')} 2>&1`
	end

	def play(path)
		execute 'clear'
		execute "add \"#{path}\""
		execute 'play'
	end

	def stop
		execute 'clear'
	end

	def progress
		if (r = execute('play').split(/\n/)).length > 1
			if r[1] =~ /([0-9]+:[0-5][0-9])\/([0-9]+:[0-5][0-9])/
				Helper::convert($1)
			end
		end
	end
end

