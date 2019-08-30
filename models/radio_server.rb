class RadioServer < ActiveRecord::Base
	validates_presence_of :name

	def loopback?
		url.nil?
	end
end

