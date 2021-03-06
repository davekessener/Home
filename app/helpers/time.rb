require 'active_support/all'

helpers do
	def timezone
		Time.zone = File.read('/etc/timezone')[0...-1] unless Time.zone
		Time.zone
	end

	def hour_of(t)
		t1 = t.beginning_of_hour
		t2 = t1.end_of_hour
		t1..t2
	end

	def day_of(t)
		t1 = t.beginning_of_day
		t2 = t1.end_of_day
		t1..t2
	end

	def to_time(t)
		timezone
		t.in_time_zone.to_s(:time)
	end

	def to_date(t)
		timezone
		t.in_time_zone.to_s.split(/ /).first
	end
end

