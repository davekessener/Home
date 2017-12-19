function load_act_form($this) {
	var content = $this.children('.act-content').val(),
		due = $this.children('.act-due').val(),
		important = $this.children('.act-important').val() != '0',
		users = $this.children('.act-users').val().split(','),
		id = $this.children('.act-id').val();
	
	clear_form_errors();

	$('#MyActContent').val(content);
	$('#MyActTime').val(due);
	$('#MyActID').val(id);
	set_important_checkbox(important);
	checkedList_setSelected($('#MyActUsers'), users);

	$('#MyActAddCtrl').addClass('hidden');
	$('#MyActReviseCtrl').removeClass('hidden');
}

// # ===========================================================================

function populate_act_list() {
	$('.edit-activity-btn').each(function() {
		var $this = $(this),
			$info = $this.parent().children('.activity-info'),
			$form = $('#MyActForm');

		$this.on('click', function() {
			if(!$form.is(':visible')) {
				$form.collapse('show');
			}
			load_act_form($info);
		});
	});

	$('.delete-activity-btn').each(function() {
		var $this = $(this);

		$this.on('click', function() {
			var data = {
				id: $this.data('target')
			}

			$.post('/calendar/delete', data, function(r) {
				update_calendar();
			});
		});
	});
}

// # ===========================================================================

function update_calendar() {
	var d = $('#MyDatePicker').datepicker('getFormattedDate');
	var u = checkedList_getSelected($('#MyUserSelector'));
	var data = { date: d, users: u };
	var view = $('#MyPageView');

	view.empty().append('<p>...</p>');

	$.post('/calendar/index', data, function(answer) {
		view.empty().append(answer);
		populate_act_list();
	});
}

$(function() {
	var $date = $('#MyDatePicker'),
		$users = $('#MyUserSelector');

	$date.datepicker({
		language: $('#MyUserLanguage').val(),
		format: "yyyy-mm-dd"
	});

	$date.on('changeDate', update_calendar);
	$users.on('changeList', update_calendar);
	
	setTimeout(update_calendar, 500);
});

// # ==========================================================================

$(document).on('submit', 'form', function(e) {
	e.preventDefault();
	return false;
});

// # ==========================================================================

function set_important_checkbox(value) {
	var $checkbox = $('#MyActImportant');

	$checkbox.prop('checked', !!value);
	$checkbox.triggerHandler('change');
}

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

function clear_form_errors() {
	$('#MyActErrors').empty();
	['Content', 'Time'].forEach(function(e) {
		$('#MyAct' + e).closest('.input-group').removeClass('has-error');
	});
}

function clear_form() {
	clear_form_errors();
	$('#MyActContent').val('');
	if($('#MyActImportant').is(':checked')) {
		$('#MyActImportantIndicator').triggerHandler('click');
	}
}

$(function() {
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
			on_valid({
				content: content,
				due: due,
				important: important,
				users: users
			});
		}
	}

	$('#MyActAdd').on('click', function() {
		handle_form(function(data) {
			$.post('/calendar/add', data, function(r) {
				update_calendar();
				clear_form();
			});
		});
	});

	$('#MyActApply').on('click', function() {
		handle_form(function(data) {
			data['id'] = $('#MyActID').val();
			$.post('/calendar/update', data, function(r) {
				update_calendar();
				clear_form();
			});
		});

		$('#MyActAddCtrl').removeClass('hidden');
		$('#MyActReviseCtrl').addClass('hidden');
	});

	$('#MyActCancel').on('click', function() {
		clear_form();
		$('#MyActAddCtrl').removeClass('hidden');
		$('#MyActReviseCtrl').addClass('hidden');
	});
});

