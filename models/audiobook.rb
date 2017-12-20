class Audiobook < ActiveRecord::Base
	belongs_to :franchise
	has_many :chapters, dependent: :destroy
	has_many :bookmarks, dependent: :destroy
	validates_presence_of :title, :duration, :franchise_id
	validates :idx, presence: true, uniqueness: true
end

