(function ($) {
	$(function () {
		var bookID = $('#MyBookID').val();

		$('.list-group-item').each(function () {
			$(this).on('click', function () {
				$.post('/audiobooks/play', {
					id: 4,
					message: {
						book_id: bookID,
						seek: $(this).children('input').val()
					}
				}, function (r) {
					window.location.replace('/audiobooks/play/' + bookID);
				});
			});
		});
	});
})(jQuery);

