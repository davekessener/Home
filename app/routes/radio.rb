get '/radio' do
	slim :'radio/index'
end

get '/radio/play/:id' do |id|
	if (device = current_device) and (station = RadioStation.find(id.to_i))
		device.play_local station

		slim :'radio/play', locals: { station: station, device: device }
	else
		status 400
	end
end

get '/radio/stop' do
	if (device = current_device)
		device.stop
	end

	redirect '/radio'
end

post '/radio/status' do
	content_type :json

	if (device = current_device)
		r = {}

		r[:playing] = device.playing.id if device.playing
		r[:volume] = device.volume

		r
	else
		{ }
	end.to_json
end

