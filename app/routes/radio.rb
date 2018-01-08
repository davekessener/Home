before '/radio' do
	request.path_info = '/radio/index'
end

get '/radio/index' do
	slim :'radio/index'
end

post '/radio/play' do
	content_type :json
	if (device = current_device) and (station = RadioStation.find(params['station'].to_i))
		device.play_local station
	end
	{ }.to_json
end

post '/radio/stop' do
	content_type :json
	if (device = current_device)
		device.stop
	end
	{ }.to_json
end

post '/radio/status' do
	content_type :json
	if (device = current_device) and device.playing?
		{ playing: device.playing.id }.to_json
	else
		{ }.to_json
	end
end

