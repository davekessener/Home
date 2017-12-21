class RadioServer < ActiveRecord::Base
	validates_presence_of :name, :url
end

