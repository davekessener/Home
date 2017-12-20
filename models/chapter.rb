class Chapter < ActiveRecord::Base
	belongs_to :audiobook
	validates_presence_of :value, :title, :audiobook_id
end

