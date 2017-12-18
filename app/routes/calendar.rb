get '/calendar' do
	slim :calendar
end

post '/calendar/index' do
	date = parse_time(params['date'])
	users = params['users']
	acts = Activity.joins(:users).where(users: {name: users}, due: day_of(date)).order(due: :asc).to_a;

	slim :'/calendar/page', layout: false, locals: {activities: acts}
end


post '/calendar/add' do
	content = params['content']
	due = parse_time(params['due'])
	users = params['users'].uniq
	important = params['important']

	a = Activity.new(content: content, due: due, important: important)

	if a.valid?
		a.save
		User.where(name: users).each { |u| a.users << u }
		':)'
	else
		status 400
		a.errors.first
	end
end
