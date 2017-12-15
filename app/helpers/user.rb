helpers do
	def current_user
		session[:user_id] ? User.find_by(id: session[:user_id]) : nil
	end

	alias_method :logged_in?, :current_user
end

