before do
	unless request.path_info == '/login' or logged_in?
		session[:return_to] = request.path_info
		redirect '/login' 
	end
	if request.path_info.start_with? '/login' and logged_in?
		redirect '/'
	end
end

get '/' do
	slim :default
end

get '/login' do
	slim :login
end

post '/login' do
	content_type :json
	uid = params['user_id']
	if uid and User.find(uid.to_i)
		session[:user_id] = uid.to_i
		{ redirect: (session[:return_to] || request.referer).to_s }.to_json
	else
		status 400
		{}.to_json
	end
end

Dir.glob("#{$root_dir}/app/routes/**/*.rb").each do |f|
	require f
end

