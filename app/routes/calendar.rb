get '/calendar' do
	slim :calendar
end

post '/calendar/index' do
	date = parse_time(params['date'])
	users = params['users']
	acts = Activity.joins(:users).where(users: {name: users}, due: day_of(date)).to_a;

	slim :'/calendar/page', layout: false, locals: {activities: acts}
end

