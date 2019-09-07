(function ($, Server) {
	const CMD_PLAY = 1,
		  CMD_STOP = 2,
		  CMD_STATUS = 3,
		  CMD_SEEK = 4,
		  CMD_VOLUME = 5;
	const ACTION_STOPPED = 1,
		  ACTION_MOVED = 2;

	var connection, dragVal = -1, state, actions = {};

	function CreateState($this) {
		var $icon = $this.children('.glyphicon');
		var isRunning = false;

		function getIconFor(s) {
			return 'glyphicon-' + (s ? 'pause' : 'play');
		}

		function setState(s) {
			if(isRunning != s) {
				$icon.removeClass(getIconFor(isRunning));
				$icon.addClass(getIconFor(s));

				isRunning = s;
			}
		}

		return {
			set: function (s) { setState(!!s); },
			get: function () { return isRunning; }
		};
	};

	function updateState(s) {
		if(typeof s.running !== 'undefined') {
			if (s.running && ! window.media_player.playing()) {
				window.media_player.play();
			}

			state.set(s.running);
		}
		if(typeof s.display !== 'undefined') {
			$('#MyDisplay').empty().append(s.display);
		}
		if(typeof s.volume !== 'undefined') {
			if(s.volume < 0) {
				$('#MyVolumeSlider').hide();
			} else if(dragVal != s.volume) {
				$('#MyVolumeSlider').slider('setValue', dragVal = s.volume);
			}
		}
	}

	function onTimeout() {
		document.location.reload();
	}

	function onError(e) {
		alert(e);
	}

	function onAction(a) {
		if(typeof actions[a] === 'function') {
			var f = actions[a];
			actions[a] = undefined;
			f();
		}
	}

	function receive(msg) {
		if(typeof msg.status !== 'undefined') {
			updateState(msg.status);
		} else if(typeof msg.error !== 'undefined') {
			onError(msg.error);
		} else if(typeof msg.action !== 'undefined') {
			onAction(msg.action);
		}
	}

	function onMoved() {
		document.location.replace('/audiobooks');
	}

	function playPause() {
		var id = $('#MyBookID').val();

		if(state.get()) {
			connection.send(CMD_STOP);

			window.media_player.stop();
		} else {
			connection.send(CMD_PLAY, id);
		}

		connection.send(CMD_STATUS, id)
	}

	function stop() {
		if(state.get()) {
			actions[ACTION_STOPPED] = onMoved;
			connection.send(CMD_STOP);
		} else {
			onMoved();
		}

		window.media_player.stop();
	}

	function seek(d) {
		connection.send(CMD_SEEK, {
			book_id: $('#MyBookID').val(),
			seek: d
		});

		window.media_player.stop();
	}

	function volume(v) {
		connection.send(CMD_VOLUME, v);

		window.volume = (+(v) - 1) / 99;
		window.media_player.volume(window.volume);
	}

	function getDefaultMsg() {
		return {
			id: CMD_STATUS,
			message: $('#MyBookID').val()
		};
	}

	function resizeList() {
		$('#MyChapterList').css('height', $('html').height() - 120);
	}

	function createMediaPlayer() {
		var url = $('#station_url').val();
		var idx = 0;

		window.volume = 1;
		window.media_player = new AudioProxy(function () {
			var p = new MediaPlayer();

			p.url(url + 'stream_' + idx + '_' + Math.floor(Math.random() * 1000000) + '.mp3');
			p.volume(window.volume);

			idx += 1;

			return p;
		});
	}

	$(function () {
		var $playBtn = $('#MyPlayPauseBtn'),
			$stopBtn = $('#MyStopBtn'),
			$seek = $('#MySeekSelector');
		var is_loopback = (document.getElementById('player') !== null);

		$playBtn.on('click', playPause);
		$stopBtn.on('click', stop);

		state = CreateState($playBtn);

		actions[ACTION_MOVED] = onMoved;

		$('.seek-select').each(function () {
			$(this).on('click', function () {
				$seek.html($(this).data('seek'))
			});
		});

		$('#MySeekForward').on('click', function () {
			seek('+' + $seek.html());
		});

		$('#MySeekBackward').on('click', function () {
			seek('-' + $seek.html());
		});

		$('#MyDoSeek').on('click', function () {
			seek($('#MySeekPos').val());
		});

		$('#MyVolumeSlider').slider('on', 'slideStop', function(v) {
			volume(v);
		});

		$('#MyChapterSelector').on('click', function () {
			document.location.replace('/audiobooks/chapters/' + $('#MyBookID').val());
		});

		$('.chapter-list-item').each(function () {
			$(this).on('click', function () {
				seek($(this).children('input').val());
			});
		});

		$(window).resize(resizeList);
		setTimeout(resizeList, 500);
		
		connection = Server.open({
			path: '/audiobooks/play',
			interval: 1000,
			maxResponseTime: 5000,
			receiver: receive,
			errorHandler: onTimeout,
			defaultMsg: getDefaultMsg
		});

		if (is_loopback) {
			createMediaPlayer();
		}
	});
})(jQuery, AsyncConnection);

