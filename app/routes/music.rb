Dir.glob("#{$root_dir}/app/music/**/*.rb").each do |fn|
	require fn
end

def probe_song(fn)
	JSON.parse(`ffprobe -i "#{fn}" -print_format json -show_format 2> /dev/null`)
end

get '/music' do
	slim :'music/index'
end

get '/music/play/:id' do |id|
	playlist = Music::Playlist.find(id.to_i)

	slim :'music/play', locals: { device: current_device, playlist: playlist }
end

post '/music/control' do
	content_type :json

	Music.execute(params, current_device, current_user).to_json
end

get '/music/song/new' do
	slim :'music/song/new'
end

get '/music/song/all' do
	slim :'music/song/all'
end

get '/music/song/edit/:id' do |id|
	if (song = Music::Song.find(id.to_i))
		slim :'music/song/edit', locals: { song: song }
	else
		redirect '/music/song/all'
	end
end

post '/music/song/edit/:id' do |id|
	if (song = Music::Song.find(id.to_i))
		song.name = params[:song_name]
		song.interpret = params[:song_interpret]
		song.release = params[:song_release]

		if song.save
			redirect '/music/song/all'
		else
			status 200
		end
	else
		status 400
	end
end

get '/music/playlist/edit' do
	slim :'music/playlist/edit', locals: { playlist: Music::Playlist.new }
end

get '/music/playlist/edit/:id' do |id|
	if (playlist = Music::Playlist.find(id.to_i))
		slim :'music/playlist/edit', locals: { playlist: playlist }
	else
		status 404
	end
end

post '/music/playlist' do
	io = $storage.request(:music)
	id = params[:id]
	name = params[:name]
	songs = params[:songs]

	playlist = ((id.nil? || id.empty?) ? Music::Playlist.new : Music::Playlist.find(id.to_i))

	playlist.name = name
	playlist.songs = []
	playlist.user = current_user

	playlist.save # stupid, but necessary

	playlist.songs = songs.map { |sid| Music::Song.find(sid.to_i) }

	content_type :json

	if playlist.save
		{ id: playlist.id }.to_json
	else
		status 400
	end
end

get '/music/song/delete/:id' do |id|
	if (song = Music::Song.find(id.to_i)) and current_user.id == song.user.id
		if params[:confirm] == 'YES'
			io = $storage.request(:music)
			fn = Storage.path('songs', song.filename)

			io.delete(fn)
			song.delete

			redirect '/music/song/all'
		else
			slim :'music/delete', locals: { song: song, playlist: nil }
		end
	else
		status 400
	end
end

get '/music/playlist/delete/:id' do |id|
	if (playlist = Music::Playlist.find(id.to_i)) and current_user.id == playlist.user.id
		if params[:confirm] == 'YES'
			playlist.delete

			redirect '/music'
		else
			slim :'music/delete', locals: { song: nil, playlist: playlist }
		end
	else
		status 400
	end
end

post '/music/upload' do
	io = $storage.request(:music)
	file = params['file']
	fn = file[:filename]
	tmpfile = file[:tempfile]
	info = probe_song tmpfile.path
	length = info['format']['duration'].to_f.ceil
	song = Music::Song.new(name: fn[0...-4], user: current_user, length: length)

	if song.save
		path = Storage.path('songs', song.filename)

		io.upload(path, tmpfile.path)

		$media_db.update

		content_type :json

		{ id: song.id }.to_json
	else
		status 200
	end
end

