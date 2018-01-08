Dir.glob("#{$root_dir}/app/audiobooks/**/*.rb").each do |fn|
	require fn
end

# ==============================================================================

before '/audiobooks' do
	request.path_info = '/audiobooks/index'
end

before '/audiobooks/*' do
	if request.get?
		if (device = current_device) and (book = device.playing) and device.user == current_user and book.is_a? Audiobook
			p = "/audiobooks/play/#{book.id}"
			redirect p unless request.path_info =~ /^\/audiobooks\/(play|chapters)/
		end
	end
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

get '/audiobooks/chapters/:id' do |id|
	if (book = Audiobook.find(id.to_i))
		slim :'audiobooks/chapters', locals: { book: book }
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

	Audiobooks::execute(params, current_device, current_user).to_json
end

