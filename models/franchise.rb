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
		File.exists? icon_path
	end

	def icon_path
		if @icon_path.nil? or path != @path_bak
			@path_bak = path
			@icon_path = File.join($root_dir, 'public', 'resources', 'icons', 'audiobooks', "#{@path_bak}.png")
		end
		@icon_path
	end
end

