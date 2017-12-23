(function ($) {
	function data() {
		return { book: $('#MyBookID').val() };
	}

	function on_error(e) {
		if(e == 4) {
			document.location.replace('/audiobooks');
		} else {
			alert('' + e);
		}
	}

	function update(s) {
		var $icon = $('#MyPlayPauseBtn').children('.glyphicon');

		if(s.id == 0) {
			$('#MyTitle').empty().append(s.playing);
			$('#MyProgress').empty().append(s.progress_fmt);

			if($icon.hasClass('.glyphicon-pause')) {
				$icon.addClass('.glyphicon-play');
				$icon.removeClass('.glyphicon-pause');
			}
		} else if(s.id == 1) {
			$('#MyTitle').empty().append($('#MyBookTitle').val());
			$('#MyProgress').empty().append('...');

			if($icon.hasClass('.glyphicon-play')) {
				$icon.addClass('.glyphicon-pause');
				$icon.removeClass('.glyphicon-play');
			}
		}
	}

	function handle(r) {
		if(typeof r.error !== 'undefined') {
			on_error(r.error);
		} else if(typeof r.status !== 'undefined') {
			update(r.status);
		}
	}

	function call(cmd) {
		$.post('/audiobooks/' + cmd, data(), handle);
	}

	function getStatus() {
		call('status');

		setTimeout(getStatus, 500);
	}

	function play() {
		call('play');
	}

	function pause() {
		call('stop');
	}

	function stop() {
		call('stop');
		setTimeout(function () {
			document.location.replace('/audiobooks');
		}, 750);
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
		getStatus();
	});
})(jQuery);

