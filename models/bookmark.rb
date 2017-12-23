class Bookmark < ActiveRecord::Base
	belongs_to :user
	belongs_to :audiobook
	validates_presence_of :value, :audiobook_id, :user_id

	def to_i
		value
	end
end

