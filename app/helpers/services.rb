helpers do
	def current_service
		sid = current_page.to_sym
		$services.find { |s| s.id == sid }
	end
end

