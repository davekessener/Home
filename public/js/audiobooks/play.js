(function ($, Server) {
	const CMD_PLAY = 1,
		  CMD_STOP = 2,
		  CMD_STATUS = 3,
		  CMD_SEEK = 4;
	const ACTION_STOPPED = 1,
		  ACTION_MOVED = 2;

	var connection, state, actions = {};

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
			state.set(s.running);
		}
		if(typeof s.display !== 'undefined') {
			$('#MyDisplay').empty().append(s.display);
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
	}

	function seek(d) {
		connection.send(CMD_SEEK, {
			book_id: $('#MyBookID').val(),
			seek: d
		});
	}

	function getDefaultMsg() {
		return {
			id: CMD_STATUS,
			message: $('#MyBookID').val()
		};
	}

	$(function () {
		var $playBtn = $('#MyPlayPauseBtn'),
			$stopBtn = $('#MyStopBtn'),
			$seek = $('#MySeekSelector');

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
		
		connection = Server.open({
			path: '/audiobooks/play',
			interval: 1000,
			maxResponseTime: 2000,
			receiver: receive,
			errorHandler: onTimeout,
			defaultMsg: getDefaultMsg
		});
	});
})(jQuery, AsyncConnection);

