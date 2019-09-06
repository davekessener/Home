get '/radio' do
	slim :'radio/index'
end

post '/radio/play' do
	content_type :json

	device = current_device
	station = RadioStation.find_by(id: params[:id].to_i)

	device.play_local station

	{ }.to_json
end

post '/radio/stop' do
	content_type :json

	device = current_device

	device.stop

	{ }.to_json
end

