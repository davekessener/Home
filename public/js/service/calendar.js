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
	if($this.attr('id') == 'MyUserSelector') {
		update_calendar();
	}
};

// # ==========================================================================

$(document).on('submit', 'form', function(e) {
	e.preventDefault();
	return false;
});

// # ==========================================================================

$(function() {
	var $checkbox = $('#MyActImportant'),
		$widget = $('#MyActImportantIndicator');
	
	$widget.css('cursor', 'pointer');
	$widget.on('click', function() {
		$checkbox.prop('checked', !$checkbox.is(':checked'));
		$checkbox.triggerHandler('change');
	});

	$checkbox.on('change', function() {
		update_display();
	});

	function update_display() {
		if($checkbox.is(':checked')) {
			$widget.css('color', '#222');
		} else {
			$widget.css('color', '#DDD');
		}
	}

	$checkbox.prop('checked', false);
	update_display();
});

// # ==========================================================================

$(function() {
	var $this = $('#MyActAdd');

	$this.on('click', function() {
		var content = $('#MyActContent').val(),
			important = $('#MyActImportant').is(':checked'),
			due = $('#MyDatePicker').datepicker('getFormattedDate') + ' ' + $('#MyActTime').val(),
			users = get_all_selected_users('#MyActUsers');

		$.post('/calendar/add', {
			content: content,
			due: due,
			important: important,
			users: users
		}, function(r) {
			update_calendar();
		});
	});
});

