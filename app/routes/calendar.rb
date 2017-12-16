get '/calendar' do
	slim :calendar
end

post '/calendar/index' do
	data = {
		date: parse_time(params['date']),
		users: params['users'].map { |name| User.find_by(name: name) }
	}

	slim :'/calendar/page', layout: false, locals: data
end

