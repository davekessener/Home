class RadioStation < ActiveRecord::Base
	validates_presence_of :name, :url, :uid

	def on_stop(user, progress)
	end

	def files
		[url]
	end

	def target_path
		nil
	end

	def thumb_path
		@thumb_path ||= "/resources/icons/radio/#{uid}.png"
	end
end

