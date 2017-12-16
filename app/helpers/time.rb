helpers do
	def parse_time(t)
		Time.zone ||= File.read('/etc/timezone')[0...-1]
		Time.zone.parse(t)
	end

	def on_day(t)
		t1 = t.beginning_of_day
		t2 = t1.end_of_day
		t1..t2
	end
end

