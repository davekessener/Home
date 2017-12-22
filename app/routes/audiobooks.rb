ERROR_NO_DEVICE = 0
ERROR_NO_BOOK = 1
ERROR_NOT_PLAYING = 2
ERROR_UNREACHABLE = 3
ERROR_MOVED = 4

STATUS_PLAYING = 0
STATUS_STOPPED = 1

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
		id: STATUS_PLAYING,
		playing: book.pretty(p),
		progress: p,
		progress_fmt: "#{Helper::to_s(p)} / #{Helper::to_s(book.duration)}"
	}
end

def get_error(id, msg)
	{
		error: { id: id, message: msg }
	}.to_json
end

post '/audiobooks/play' do
	content_type :json

	if (player = current_device).nil?
		get_error(ERROR_NO_DEVICE, 'FATAL: No device selected!')
	elsif (book = Audiobook.find(params['book'].to_i)).nil?
		get_error(ERROR_NO_BOOK, "FATAL: No book selected! (id = #{params['book']})")
	elsif not player.reachable?
		player.stop if player.playing?
		get_error(ERROR_UNREACHABLE, s('unreachable'))
	else
		bm = Bookmark.where(desc: [nil, ''], user: current_user).first
		bm = Bookmark.find(params['bookmark'].to_i) if params['bookmark']

		player.play(book, current_user)
		player.seek(bm.value) if bm

		{ }.to_json
	end
end

post '/audiobooks/stop' do
	content_type :json

	if (player = current_device).nil?
		get_error(ERROR_NO_DEVICE, 'FATAL: No device selected!')
	elsif not player.playing?
		get_error(ERROR_NOT_PLAYING, 'Not playing.')
	else
		player.stop

		{ }.to_json
	end
end

post '/audiobooks/status' do
	content_type :json

	if (player = current_device).nil?
		get_error(ERROR_NO_DEVICE, 'FATAL: No device selected!')
	elsif not player.reachable?
		get_error(ERROR_UNREACHABLE, s('unreachable'))
	elsif player.playing? and (player.user != current_user or player.playing.id != params['book'].to_i)
		get_error(ERROR_MOVED, s('moved'));
	else
		if player.done?
			player.stop if player.playing?
			{ status: { id: STATUS_STOPPED } }.to_json
		else
			{ status: get_status(player, player.playing) }.to_json
		end
	end
end

