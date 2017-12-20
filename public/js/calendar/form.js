function handle_form(on_valid) {
	var $content = $('#MyActContent'),
		$important = $('#MyActImportant'),
		$due = $('#MyActTime'),
		$errors = $('#MyActErrors');
	var content = $content.val(),
		important = $important.is(':checked'),
		time = $.trim($due.val()),
		due = $('#MyDatePicker').datepicker('getFormattedDate') + ' ' + time,
		users = checkedList_getSelected($('#MyActUsers')),
		errors = [];

	if(content == '') {
		$content.closest('.input-group').addClass('has-error');
		errors.push('#form_warn_content');
	}

	if(!/^(([01]?[0-9])|(2[0-3])):[0-5][0-9]$/.test(time)) {
		$due.closest('.input-group').addClass('has-error');
		errors.push('#form_warn_time');
	}

	if(users.length < 1) {
		errors.push('#form_warn_users');
	}

	if(errors.length > 0) {
		errors.forEach(function (e) {
			$errors.append(
				'<p>' +
					'<label>' +
						'<span class="glyphicon glyphicon-remove-circle error-signal" />' +
						$(e).val() +
					'</label>' +
				'</p>');
		});
	} else {
		on_valid({
			content: content,
			due: due,
			important: important,
			users: users
		});
	}
}

function clear_form() {
	clear_form_errors();
	$('#MyActContent').val('');
	if($('#MyActImportant').is(':checked')) {
		$('#MyActImportantIndicator').triggerHandler('click');
	}
}

function clear_form_errors() {
	$('#MyActErrors').empty();
	['Content', 'Time'].forEach(function (e) {
		$('#MyAct' + e).closest('.input-group').removeClass('has-error');
	});
}

$(document).on('submit', 'form', function (e) {
	e.preventDefault();
	return false;
});

