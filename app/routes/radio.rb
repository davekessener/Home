get '/radio' do
	slim :'radio/index', locals: { device: current_device }
end

post '/radio/play' do
	content_type :json

	device = current_device
	station = RadioStation.find_by(id: params[:id].to_i)

	device.play_local station

	{ }.to_json
end

post '/radio/volume' do
	content_type :json

	device = current_device

	device.volume = params[:volume].to_i

	{ }.to_json
end

post '/radio/stop' do
	content_type :json

	device = current_device

	device.stop

	{ }.to_json
end

