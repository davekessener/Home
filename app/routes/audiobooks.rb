Dir.glob("#{$root_dir}/app/audiobooks/**/*.rb").each do |fn|
	require fn
end

# ==============================================================================

before '/audiobooks' do
	request.path_info = '/audiobooks/index'
end

get '/audiobooks/index' do
	slim :'audiobooks/index'
end

get '/audiobooks/franchise/:id' do |id|
	if (f = Franchise.find(id.to_i))
		if f.audiobooks.length > 1
			slim :'audiobooks/franchise', locals: { franchise: f }
		else
			redirect "/audiobooks/play/#{f.audiobooks.first.id}"
		end
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

# ==============================================================================

post '/audiobooks/play' do
	content_type :json

	Audiobooks::play(
		current_user,
		current_device,
		Audiobook.find(params['book'].to_i),
		params['bookmark']).to_json
end

post '/audiobooks/stop' do
	content_type :json

	Audiobooks::stop(current_device).to_json
end

post '/audiobooks/status' do
	content_type :json

	Audiobooks::status(current_device, current_user, params['book'].to_i).to_json
end

