before do
	p = current_page
	pass unless p == 'audiobooks' or p == 'radio'
	if (device = current_device).nil?
		session[:return_to] = request.path_info
		request.path_info = '/device/select'
	elsif device.playing? and device.user != current_user
		session[:return_to] = request.path_info
		request.path_info = '/device/kill'
	end
end

get '/device/kill' do
	slim :'device/kill'
end

get '/device/select' do
	did = params['device']
	if did and RadioServer.find(did.to_i)
		session[:playback_device] = did.to_i
		redirect (session[:return_to] || '/')
	else
		slim :'device/select'
	end
end


