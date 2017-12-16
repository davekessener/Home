before do
	unless request.path_info == '/login' or logged_in?
		session[:return_to] = request.path_info
		redirect '/login' 
	end
end

get '/' do
	slim :default
end

get '/login' do
	uid = params['user_id']
	if uid and User.find_by(id: uid)
		session[:user_id] = uid
		redirect (session[:return_to] || request.referer)
	else
		slim :login
	end
end

