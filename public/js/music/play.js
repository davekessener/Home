(function ($, Server) {
	const CMD_REGISTER = 1;
	const CMD_PAUSE = 2;
	const CMD_RESUME = 3;
	const CMD_STATUS = 4;
	const CMD_SEEK = 5;
	const CMD_NEXT = 6;
	const CMD_PREV = 7;
	const CMD_MODE = 8;
	const CMD_VOLUME = 9;

	const ACTIONE_MOVED = 1;
	const ACTION_STOPPED = 2;

	const MODE_NORMAL = 0;
	const MODE_REPEAT_ONE = 1;
	const MODE_REPEAT_ALL = 2;
	const MODE_SHUFFLE = 3;

	var MultiIconButton = (function () {
		function MultiIconButton() {
			var self = this;

			self.$_base = $('<div></div>');
			self._buttons = [];
			self._listeners = [];
		}

		MultiIconButton.prototype.listen = function (f) {
			var self = this;

			self._listeners.push(f);
		};

		MultiIconButton.prototype.setState = function (s) {
			var self = this;

			if (self._state !== undefined) {
				self._buttons[self._state].detach();
			}

			self._state = s;
			self.$_base.append(self._buttons[s]);

			self._listeners.forEach(function (f) {
				f(s);
			});
		};

		MultiIconButton.prototype.add = function (icon, cb) {
			var self = this;

			var $btn = $('<button class="btn btn-default"></button>');

			$btn.append($('<span class="glyphicon glyphicon-' + icon + '"></span>'));

			$btn.click(function () {
				if (! $btn.hasClass('disabled')) {
					cb();
				}
			});

			self._buttons[icon] = $btn;

			if (self._state === undefined) {
				self.setState(icon);
			}
		};

		MultiIconButton.prototype.disable = function (icon) {
			var self = this;

			self._buttons[icon].addClass('disabled');
		};

		MultiIconButton.prototype.enable = function (icon) {
			var self = this;

			self._buttons[icon].removeClass('disabled');
		};

		return MultiIconButton;
	})();

	var ButtonPanel = (function () {
		function attachCallback(self, id) {
			return function () {
				var f = self[id];

				if (typeof f === 'function') {
					f();
				}
			};
		}

		function ButtonPanel() {
			var self = this;

			self.$_base = $('<div style="display: flex; align-items: center;"></div>');

			self._pp_btn = new MultiIconButton();

			self._pp_btn.add('play', attachCallback(self, 'onPlay'));
			self._pp_btn.add('pause', attachCallback(self, 'onPause'));

			self._back_btn = new MultiIconButton();

			self._back_btn.add('fast-backward', attachCallback(self, 'onPrevious'));

			self._reset_btn = new MultiIconButton();

			self._reset_btn.add('step-backward', attachCallback(self, 'onReplay'));

			self._next_btn = new MultiIconButton();

			self._next_btn.add('fast-forward', attachCallback(self, 'onNext'));

			self._mode_btn = new MultiIconButton();

			self._mode_btn.add('arrow-right', attachCallback(self, 'onNormal'));
			self._mode_btn.add('repeat', attachCallback(self, 'onSingleRepeat'));
			self._mode_btn.add('refresh', attachCallback(self, 'onAllRepeat'));
			self._mode_btn.add('random', attachCallback(self, 'onShuffle'));

			self.$_base.append(self._back_btn.$_base);
			self.$_base.append(self._reset_btn.$_base);
			self.$_base.append(self._pp_btn.$_base);
			self.$_base.append(self._next_btn.$_base);
			self.$_base.append(self._mode_btn.$_base);

			self.play_button = self._pp_btn;
			self.previous_button = self._back_btn;
			self.replay_button = self._reset_btn;
			self.next_button = self._next_btn;
			self.mode_button = self._mode_btn;
		}

		return ButtonPanel;
	})();

	var InfoPane = (function () {
		function InfoPane() {
			var self = this;

			self.$_base = $('<div style="padding-bottom: 16px;"></div>');

			self.$_info = $('<h3 class="cropped">---</h3>');

			self.$_base.append(self.$_info);
		}

		InfoPane.prototype.set = function (v) {
			var self = this;

			self.$_info.text(v);
		};

		return InfoPane;
	})();

	var VolumeSlider = (function () {
		function VolumeSlider($e) {
			var self = this;

			self.$_base = $('<div style="padding-bottom: 10px;"></div>');
			self.$_slider = $('#' + $e.data('slider-id'));
			self.$_proxy = $e;

			self.$_proxy.slider('on', 'slideStop', function (v) {
				var f = self.onChange;

				if (f) {
					f(+(v) / 100);
				}
			});

			self.$_slider.detach();
			self.$_proxy.detach();

			self.$_base.append(self.$_slider);
			self.$_base.append(self.$_proxy);
		}

		return VolumeSlider;
	})();

	var PlayerUI = (function () {
		function PlayerUI() {
			var self = this;

			self.$_base = $('<div class="well wide"></div>');
			self._bar = new ProgressBar();
			self._buttons = new ButtonPanel();
			self._info = new InfoPane();
			self._volume = new VolumeSlider($('#volume_slider'));

			self.$_base.append(self._info.$_base);
			self.$_base.append(self._volume.$_base);
			self.$_base.append(self._buttons.$_base);

			self._bar.showText(false);
			self._bar.$_base.addClass('full-progress-bar');

			$('.song-item').each(function (i, e) {
				$(e).click(function (x) {
					self.onSongClick(i, x);
				});
			});

			self._buttons.onPlay = function () {
				self._con.send(CMD_RESUME);
			};

			self._buttons.onPause = function () { 
				self._con.send(CMD_PAUSE);
				window.media_player.stop();
			};

			self._buttons.onNext = function () {
				self._con.send(CMD_NEXT);
				window.media_player.stop();
				self._running = false;
			};

			self._buttons.onPrevious = function () {
				self._con.send(CMD_PREV);
				window.media_player.stop();
				self._running = false;
			};

			self._buttons.onReplay = function () {
				self._con.send(CMD_SEEK, 0);
				window.media_player.stop();
				self._running = false;
			};

			self._buttons.onNormal = function () {
				self._con.send(CMD_MODE, MODE_REPEAT_ONE);
				self._buttons.mode_button.setState('repeat');
			};

			self._buttons.onSingleRepeat = function () {
				self._con.send(CMD_MODE, MODE_REPEAT_ALL);
				self._buttons.mode_button.setState('refresh');
			};

			self._buttons.onAllRepeat = function () {
				self._con.send(CMD_MODE, MODE_SHUFFLE);
				self._buttons.mode_button.setState('random');
			};

			self._buttons.onShuffle = function () {
				self._con.send(CMD_MODE, MODE_NORMAL);
				self._buttons.mode_button.setState('arrow-right');
			};

			self._volume.onChange = function (v) {
				window.volume = v;
				window.media_player.volume(v);
				self._con.send(CMD_VOLUME, v);
			};

			self._con = Server.open({
				path: '/music/control',
				interval: 1000,
				maxResponseTime: 5000,
				receiver: function (r) {
					self.receive(r);
				},
				errorHandler: function (e) {
					self.onError(e);
				},
				defaultMsg: function () {
					return {
						id: CMD_STATUS
					};
				}
			});
		}

		PlayerUI.prototype.register = function () {
			var self = this;

			self._con.send(CMD_REGISTER, {
				playlist: +($('#playlist_id').val())
			});
		};

		PlayerUI.prototype.receive = function (msg) {
			var self = this;

			if (msg.status !== undefined) {
				if (msg.status.index !== self._index) {
					var $song = $('#song_' + msg.status.index);

					self.reset();

					$song.prepend(self._bar.$_base);

					self._index = msg.status.index;
				}

				self._info.set(msg.status.song + ' ' + time_to_s(msg.status.elapsed) + ' / ' + time_to_s(msg.status.total));
				self._bar.update(msg.status.elapsed / (msg.status.total - 1));

				if (msg.status.running != self._running) {
					if (msg.status.running) {
						self._buttons.play_button.setState('pause');
						window.media_player.play();
					} else {
						self._buttons.play_button.setState('play');
						window.media_player.stop();
					}
				}

				self._running = msg.status.running;
				self._length = msg.status.total;
			}

			if (msg.error !== undefined) {
				self.onError(msg.error);
			}

			if (msg.action !== undefined) {
				if (msg.action == ACTION_STOPPED) {
					self.reset();
				} else if (msg.action == ACTION_MOVED) {
				} else {
					console.log('ERROR', msg);
					alert('unknown action: ' + msg.action);
				}
			}
		};

		PlayerUI.prototype.reset = function () {
			var self = this;

			self._bar.$_base.detach();
			self._info.set('-----');
		};

		PlayerUI.prototype.onError = function (e) {
			var self = this;

			console.log(e);
		};

		PlayerUI.prototype.onSongClick = function (i, e) {
			var self = this;

			var progress = {
				song: i,
				elapsed: 0
			};

			if (i == self._index) {
				progress = Math.floor(self._length * e.originalEvent.layerX / e.currentTarget.clientWidth);
			}

			window.media_player.stop();
			self._running = false;
			self._con.send(CMD_SEEK, progress);
		};

		return PlayerUI;
	})();

	function handleLoopback() {
		var is_loopback = (document.getElementById('player') !== null);
		var i = 0;

		window.volume = 1;

		function createMediaPlayer() {
			var p = new MediaPlayer();

			p.url($('#station_url').val() + 'stream_' + i + '_' + Math.floor(Math.random() * 1000000) + '.mp3');
			p.volume(window.volume);

			i += 1;

			return p;
		}

		function createHowlClient() {
			var howl = new Howl({
				src: [ $('#station_url').val() ],
				html5: true,
				format: [ 'mp3' ]
			});

			if (howl.stop === undefined) {
				howl.stop = howl.unload;
			}

			return howl;
		}

		window.media_player = new AudioProxy(is_loopback ? createMediaPlayer : undefined);
	}

	function createPlayerInterface() {
		var ui = new PlayerUI();

		window.player_ui = ui;

		ui.register();

		$('#player_ui').append(ui.$_base);
	}

	$(function () {
		handleLoopback();
		createPlayerInterface();
	});
})(jQuery, AsyncConnection);

