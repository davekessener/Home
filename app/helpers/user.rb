helpers do
	def current_user
		if (uid = session[:user_id])
			if @current_user.nil? or @current_user.id != uid
				@current_user = User.find(uid)
			end
			@current_user
		end
	end

	alias_method :logged_in?, :current_user
end

