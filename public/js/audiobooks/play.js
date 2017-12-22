(function ($) {
	function data() {
		return { book: $('#MyBookID').val() };
	}

	function on_error(e) {
		$('#MyError').append(e);
	}

	function update(s) {
		$('#MyTitle').empty().append(s.playing);
		$('#MyProgress').empty().append(s.progress_fmt);
	}

	function handle(r) {
		if(typeof r.error !== 'undefined') {
			on_error(r.error);
		} else if(typeof r.status !== 'undefined') {
			update(r.status);
			setTimeout(getStatus, 500);
		}
	}

	function call(cmd) {
		$.post('/audiobooks/' + cmd, data(), handle);
	}

	function getStatus() {
		call('status');
	}

	function play() {
		call('play');
	}

	function pause() {
		call('stop');
	}

	function stop() {
		call('stop');
		document.location.replace('/audiobooks');
	}

	$(function () {
		$('#MyPlayPauseBtn').on('click', function () {
			var $span = $($(this).children('.glyphicon'));

			if($span.hasClass('glyphicon-play')) {
				$span.removeClass('glyphicon-play');
				$span.addClass('glyphicon-pause');

				play();
			} else {
				$span.addClass('glyphicon-play');
				$span.removeClass('glyphicon-pause');

				pause();
			}
		});

		$('#MyStopBtn').on('click', stop);

		play();
	});
})(jQuery);

