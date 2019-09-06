before do
	pass if not request.get?
	service = current_service
	pass if service.nil?
	pass if not current_service.needs_speaker?

	if (device = current_device).nil?
		user = current_user
		if (device = RadioServer.all.to_a.find { |d| d.id == user.last_device })
			session[:playback_device] = device.id
		else
			session[:return_to] = request.path_info
			redirect '/device/select'
		end
	elsif device.playing? and not device.loopback? and (device.user and device.user != current_user)
		session[:return_to] = request.path_info
		redirect '/device/kill'
	elsif not device.reachable?
		redirect '/device/unreachable'
	end
end

get '/devices' do
	session[:return_to] = request.referer
	redirect '/device/select'
end

get '/device/kill' do
	if params['confirm']
		current_device.stop
		redirect (session[:return_to] || '/')
	else
		slim :'device/kill'
	end
end

get '/device/select' do
	did = params['device'].to_i
	if RadioServer.exists?(id: did)
		session[:playback_device] = did
		(user = current_user).last_device = did
		user.save!

		redirect (session[:return_to] || '/')
	else
		slim :'device/select'
	end
end

get '/device/unreachable' do
	slim :'device/unreachable'
end

