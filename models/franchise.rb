class FranchiseCallbacks
	def self.after_destroy(franchise)
		File.delete(franchise.icon_path)
	end
end

class Franchise < ActiveRecord::Base
	has_many :audiobooks, dependent: :destroy
	validates :name, presence: true
	validates :path, presence: true
	validate :icon_exists?
	after_destroy FranchiseCallbacks

	def icon_exists?
		File.exists? "#{$root_dir}/public#{thumb_path}"
	end

	def target_path
		@target_path ||= "/audiobooks/franchise/#{id}"
	end

	def thumb_path
		@thumb_path ||= "/resources/icons/audiobooks/#{path}.png"
	end
end

