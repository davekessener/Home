before '/audiobooks' do
	request.path_info = '/audiobooks/index'
end

get '/audiobooks/index' do
	slim :'audiobooks/index'
end

get '/audiobooks/franchise/:id' do |id|
	if (f = Franchise.find(id.to_i))
		slim :'audiobooks/franchise', locals: { franchise: f }
	else
		status 404
	end
end

get '/audiobooks/play/:id' do |id|
	if (book = Audiobook.find(id.to_i))
		slim :'audiobooks/play', locals: { book: book }
	else
		status 404
	end
end

def get_status(player, book)
	p = player.progress.to_i
	{
		playing: book.pretty(p),
		progress: p,
		progress_fmt: "#{Helper::to_s(p)} / #{Helper::to_s(book.duration)}"
	}
end

post '/audiobooks/play' do
	content_type :json

	if (player = current_device).nil?
		{ error: 'FATAL: No device selected!'}.to_json
	elsif (book = Audiobook.find(params['book'].to_i)).nil?
		{ error: "FATAL: No book selected! (id = #{params['book']})" }.to_json
	elsif not player.reachable?
		player.stop if player.playing?
		{ error: s('unreachable') }
	else
		bm = Bookmark.where(desc: [nil, ''], user: current_user).first
		bm = Bookmark.find(params['bookmark'].to_i) if params['bookmark']

		player.play(book, current_user)
		player.seek(bm.value) if bm

		{ status: get_status(player, book) }.to_json
	end
end

post '/audiobooks/stop' do
	content_type :json

	if (player = current_device).nil?
		{ error: 'FATAL: No device selected!' }.to_json
	elsif not player.playing?
		{ error: 'Not playing.' }.to_json
	else
		player.stop
	end
end

post '/audiobooks/status' do
	content_type :json

	if (player = current_device).nil?
		{ error: 'FATAL: No device selected!' }.to_json
	elsif not player.playing?
		{ error: 'Not playing.' }.to_json
	else
		{ status: get_status(player, player.playing) }.to_json
	end
end

