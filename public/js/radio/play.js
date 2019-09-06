(function ($) {
	function updateStatus() {
		$.post('/radio/status', function (r) {
			if (r.playing !== undefined) {
			}

			if (r.volume !== undefined) {
			}

			if (r.status !== undefined) {
				$('#status').text(r.status);
			}

			setTimeout(updateStatus, 2000);
		});
	}

	function createMediaPlayer() {
		var $state = $('#status');
		var wait_msg = $('#msg_wait').val();
		var url = $('#station_url').val();
		var p = new MediaPlayer();

		window.media_player = p;

		p.setURL(url);

		p.onStateChange(function (state) {
			if (state == MediaPlayer.STATE_PENDING) {
				$state.html(wait_msg);
			} else if (state == MediaPlayer.STATE_PLAYING) {
				updateStatus();
			}
		});

		$('#player').append(p.$_base);
	}

	function attachPlayButton() {
		var $play = $('#play_button');

		$play.click(function () {
			window.media_player.play();
			$play.addClass('hidden');
			showStopButton();
			$('#stop_button').focus();
		});
	}

	function showStopButton() {
		$('#stop_button').removeClass('hidden');
	}

	$(function () {
		var is_loopback = (document.getElementById('player') !== null);

		if (is_loopback) {
			createMediaPlayer();
			attachPlayButton();
		} else {
			showStopButton();
		}
	});
})(jQuery);

