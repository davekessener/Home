helpers do
	def current_page
		url = request.path_info
		page = url.include?('?') ? url[1...url.index('?')] : url[1..-1]
		page = page.split(/\//).first
		(page.nil? or page.empty?) ? 'default' : page
	end

	def resource_path(type)
		t = request.path_info.split(/\//)
		if t.empty?
			url = 'main'
		else
			url = t[1..2].join('/')
		end
		"/#{type}/#{url}.#{type}"
	end
end

