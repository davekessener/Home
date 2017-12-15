before do
	redirect '/login' unless request.path_info == '/login' or logged_in?
end

get '/' do
	slim :default
end

get '/login' do
	uid = params['user_id']
	if uid and User.find_by(id: uid)
		session[:user_id] = uid
		redirect '/'
	else
		slim :login
	end
end

