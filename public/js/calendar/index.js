(function ($, viewport) {
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
		glyphCheckbox_set($('#MyActImportant'), important);
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
				if($form.is(':visible')) {
					load_act_form($info);
				} else {
					var id = $info.children('.act-id').val();

					window.location.replace('/calendar/edit?id=' + id);
				}
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
		$('#MyActForm').removeClass('collapse');
	});
	
	// # ==========================================================================
	
	$(function() {
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

		$('#MyActNew').on('click', function () {
			document.location.replace('/calendar/edit');
		});
	});
})(jQuery, ResponsiveBootstrapToolkit);
