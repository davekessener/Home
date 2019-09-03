before do
	unless request.path_info.start_with? '/login' or logged_in?
		session[:return_to] = request.path_info
		redirect '/login' 
	end
end

get '/' do
	slim :default
end

get '/login' do
	slim :login
end

get '/login/:id' do |id|
	id = id.to_i

	if (user = User.find(id))
		session[:user_id] = id

		redirect (session[:return_to] || '/')
	else
		status 404
	end
end

Dir.glob("#{$root_dir}/app/routes/**/*.rb").each do |f|
	require f
end

