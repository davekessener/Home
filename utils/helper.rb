module Helper
	def self.read_utf8(fn)
		s = File.open(fn, 'r:UTF-8', &:read)
		((s[0] && s[0].ord == 65279) ? s[1..-1] : s)
	end

	def self.symbolized_hash(h)
		return h unless h.is_a? Hash

		r = {}
		h.each do |k, v|
			r[(k.to_sym rescue k) || k] = Helper::symbolized_hash(v)
		end
		r
	end

	def self.convert(t)
		l, s = 0, 1
		t.split(/:/).reverse_each do |p|
			l += s * p.to_i
			s *= 60
		end
		l
	end

	def self.to_s(d)
		s, d = d % 60, d / 60
		m, d = d % 60, d / 60
		[d, m, s].map { |e| '%02d' % e }.join(':')
	end

	def self.is_server_reachable?(url)
		(`fping -q -c 1 -t 300 "#{url}" 2>&1` =~ /xmt\/rcv\/%loss = 1\/1/)
	end

	module Linguistics
		def self.table
			@@content ||= [
			]
		end

		def self.plural(s)
		end

		def self.singular(s)
		end
	end
end

