function update_calendar() {
	var d = $('#MyDatePicker').datepicker('getFormattedDate');
	var u = get_all_selected_users('#MyUserSelector');
	var data = { date: d, users: u };
	var view = $('#MyPageView');

	view.empty().append('<p>...</p>');

	$.post('/calendar/index', data, function(answer) {
		view.empty().append(answer);
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

on_user_selection_change = function($this) {
	update_calendar();
};

