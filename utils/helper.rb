module Helper
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

	def self.is_server_reachable(url)
		(`fping -q -c 1 -t 300 "#{url}" 2>&1` =~ /xmt\/rcv\/%loss = 1\/1/)
	end
end

