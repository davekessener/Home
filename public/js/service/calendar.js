function update_calendar() {
	var d = $('#MyDatePicker').datepicker('getFormattedDate');
	var u = get_all_selected_users();
	var data = { date: d, users: u };
	var view = $('#MyPageView');

	view.empty();

	$.post('/calendar/index', data, function(answer) {
		view.append(answer);
	});
}

$(function() {
	$('#MyDatePicker').datepicker({
		language: $('#MyUserLanguage').val(),
		format: "yyyy-mm-dd"
	});

	$('#MyDatePicker').on('changeDate', update_calendar);
	
	update_calendar();
});

on_user_selection_change = function(users) {
	update_calendar();
};

