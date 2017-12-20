(function ($, viewport) {
	var $date = $('#MyDatePicker');

	$date.datepicker({
		language: $('#MyUserLanguage').val(),
		format: "yyyy-mm-dd"
	});

	$(function () {
		$('#MyActAdd').on('click', function () {
			handle_form(function (data) {
				$.post('/calendar/add', data, function (r) {
					document.location.replace('/calendar/index');
				});
			});
		});

		$('#MyActApply').on('click', function () {
			handle_form(function (data) {
				data['id'] = $('#MyActID').val();
				$.post('/calendar/update', data, function (r) {
					document.location.replace('/calendar/index');
				});
			});
		});

		$('#MyActCancel').on('click', function () {
			document.location.replace('/calendar/index');
		});
	});
})(jQuery, ResponsiveBootstrapToolkit);

