(function ($) {
	function play(id) {
		$.post('/radio/play', { station: id });
	}

	function stop() {
		$.post('/radio/stop');
	}

	function update() {
		var $status = $('#MyStatus');

		$.post('/radio/status', function (r) {
			$('.radio-station').each(function () {
				$(this).removeClass('active');
			});

			$status.empty().append('...');

			if(typeof r.playing !== 'undefined') {
				$('.radio-station').each(function () {
					if($(this).data('station-id') == r.playing) {
						$(this).addClass('active');
					}
				});
			}
			if(typeof r.status !== 'undefined') {
				$status.empty().append(r.status);
			}
			if(typeof r.volume !== 'undefined') {
			}
		});

		setTimeout(update, 3000);
	}

	$(function () {
		$('.radio-station').each(function () {
			var $this = $(this);

			$this.on('click', function () {
				if($this.hasClass('active')) {
					stop();
				} else {
					play($this.data('station-id'));
				}
			});
		});

		setTimeout(update, 500);
	});
})(jQuery);

