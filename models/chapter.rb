class Chapter < ActiveRecord::Base
	belongs_to :audiobook
	validates_presence_of :value, :audiobook_id
end

