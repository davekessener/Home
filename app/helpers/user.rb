helpers do
	def current_user
		session_load(session[:user_id], User)
	end

	alias_method :logged_in?, :current_user
end

