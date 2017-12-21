helpers do
	def current_device
		session_load(session[:playback_device], RadioServer).try do |device|
			MediaPlayer.by_device(device)
		end
	end
end


