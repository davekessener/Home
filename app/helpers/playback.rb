helpers do
	def current_device
		session_load(session[:playback_device], RadioServer).try do |device|
			MediaPlayer.by_device(current_user, device)
		end
	end
end


