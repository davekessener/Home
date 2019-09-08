require 'socket'

module MPC
	class Connection
		def initialize(host, port)
			@host, @port = host.to_s, port.to_i
			@socket = Connection::connect(@host, @port)
			status, verify, version = *receive.split(/ /)
			raise unless status == 'OK' and verify == 'MPD'
			@version = version
		end
	
		def receive(timeout = 1)
			begin
				@socket.read_nonblock(65535).strip
			rescue IO::WaitReadable
				if IO.select([@socket], nil, nil, timeout)
					retry
				else
					@socket.close
					raise "Connection timeout"
				end
			end
		end
	
		def execute_all(cmds)
			unless cmds.empty?
				cmds.unshift 'command_list_begin'
				cmds.push 'command_list_end'
				puts "mpc -h \"#{@host}\" -p #{@port} {#{cmds.join(', ')}}"
				@socket.puts(cmds.map { |e| e.strip }.join("\n"))
			end
			response
		end
	
		def execute(cmd = nil, &block)
			if cmd
				if cmd.is_a? Array
					execute_all(cmd)
				else
					puts "mpc -h \"#{@host}\" -p #{@port} #{cmd}"
					@socket.puts(cmd.strip)
					response
				end
			elsif block_given?
				execute_all([].tap { |a| block.call(a) })
			end
		end
	
		def response
			r = (@response = receive).split(/\n/)
			raise unless r[-1] == 'OK'
			@response = {}
			r.each do |line|
				k, v = *line.strip.split(/:[ \t]+/, 2)
				@response[k] = v if v
			end
			@response
		end
	
		def close
			@socket.close
		end
	
		def self.open(host, port)
			begin
				c = Connection.new(host, port)
				if block_given?
					yield c
					c.close
					true
				else
					c
				end
			rescue
				return nil
			end
		end
	
		def self.connect(host, port, timeout = 5)
			addr = Socket.getaddrinfo(host, nil)
			sockaddr = Socket.pack_sockaddr_in(port, addr[0][3])
	
			Socket.new(Socket.const_get(addr[0][0]), Socket::SOCK_STREAM, 0).tap do |socket|
				socket.setsockopt(Socket::IPPROTO_TCP, Socket::TCP_NODELAY, 1)
	
				begin
					socket.connect_nonblock(sockaddr)
				rescue IO::WaitWritable
					if IO.select(nil, [socket], nil, timeout)
						begin
							socket.connect_nonblock(sockaddr)
						rescue Errno::EISCONN
						rescue
							socket.close
							raise
						end
					else
						socket.close
						raise "Connection timeout"
					end
				end
			end
		end
	end
end

