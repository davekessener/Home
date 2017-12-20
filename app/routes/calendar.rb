get '/calendar' do
	redirect '/calendar/index'
end

get '/calendar/index' do
	slim :'calendar/index'
end

get '/calendar/edit' do
	id = params['id']
	data = { activity: nil }

	data[:activity] = Activity.find(id.to_i) if id

	slim :'calendar/edit', locals: data
end

post '/calendar/index' do
	date = timezone.parse(params['date'])
	users = params['users']
	acts = Activity.joins(:users).where(users: {name: users}, due: day_of(date)).order(due: :asc).to_a.uniq;

	slim :'/calendar/page', layout: false, locals: {activities: acts}
end

post '/calendar/add' do
	content = params['content']
	due = timezone.parse(params['due'])
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

post '/calendar/delete' do
	id = params['id'].to_i

	if (a = Activity.find(id))
		a.destroy

		':('
	else
		status 400
		"unknown id #{id}"
	end
end

post '/calendar/update' do
	id = params['id'].to_i
	content = params['content']
	due = timezone.parse(params['due'])
	users = params['users'].uniq
	important = params['important']

	a = Activity.find(id)

	if not a.nil?
		a.content = content
		a.due = due
		a.important = important

		if a.valid?
			a.save
			a.users.clear
			User.where(name: users).each { |u| a.users << u }
			':P'
		else
			status 400
			a.errors.first
		end
	else
		status 400
		"invalid id #{id}"
	end
end

