class Activity < ActiveRecord::Base
	validates :content, presence: true
	validates :due, presence: true

	has_and_belongs_to_many :users
end

