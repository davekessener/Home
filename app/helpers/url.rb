helpers do
	def current_page
		url = request.path_info
		page = url.include?('?') ? url[1...url.index('?')] : url[1..-1]
		page = page.split(/\//).first
		(page.nil? or page.empty?) ? 'default' : page
	end

	def resource_path(type)
		t = request.path_info.split(/\//)
		t.shift
		if t.empty?
			url = 'main'
		else
			t.pop while t.last =~ /^[0-9]+$/
			url = t.join('/')
		end
		"/#{type}/#{url}.#{type}"
	end

	def h(v)
		Rack::Utils.escape_html(v)
	end
end

