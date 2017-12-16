function login_user(uid, do_redirect = false) {
	$.post("/login", { user_id: uid }, function(data) {
		if(do_redirect) {
			window.location.replace(data.redirect);
		} else {
			window.location.reload();
		}
	});
}

