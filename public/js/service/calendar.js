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
	
	setTimeout(update_calendar, 500);
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
		var $content = $('#MyActContent'),
			$important = $('#MyActImportant'),
			$due = $('#MyActTime'),
			$errors = $('#MyActErrors');
		var content = $content.val(),
			important = $important.is(':checked'),
			time = $.trim($due.val()),
			due = $('#MyDatePicker').datepicker('getFormattedDate') + ' ' + time,
			users = get_all_selected_users('#MyActUsers'),
			errors = [];

		$errors.empty();

		if(content == '') {
			$content.closest('.input-group').addClass('has-error');
			errors.push('#form_warn_content');
		} else {
			$content.closest('.input-group').removeClass('has-error');
		}

		if(!/^(([01][0-9])|(2[0-3])):[0-5][0-9]$/.test(time)) {
			$due.closest('.input-group').addClass('has-error');
			errors.push('#form_warn_time');
		} else {
			$due.closest('.input-group').removeClass('has-error');
		}

		if(users.length < 1) {
			errors.push('#form_warn_users');
		}

		if(errors.length > 0) {
			errors.forEach(function(e) {
				$errors.append(
					'<p>' +
						'<label>' +
							'<span class="glyphicon glyphicon-remove-circle error-signal" />' +
							$(e).val() +
						'</label>' +
					'</p>');
			});
		} else {
			$.post('/calendar/add', {
				content: content,
				due: due,
				important: important,
				users: users
			}, function(r) {
				update_calendar();
			});
		}
	});
});

