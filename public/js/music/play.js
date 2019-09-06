(function ($, Server) {
	const CMD_REGISTER = 1;
	const CMD_PAUSE = 2;
	const CMD_RESUME = 3;
	const CMD_STATUS = 4;

	var PlayPauseButton = (function () {
		function PlayPauseButton() {
			var self = this;

			self.$_base = $('<div></div>');

			self.$_play = $('<button class="btn btn-default"></button>');
			self.$_pause = $('<button class="btn btn-default"></button>');
			
			self.$_play.append($('<span class="glyphicon glyphicon-play"></span>'));
			self.$_pause.append($('<span class="glyphicon glyphicon-pause"></span>'));

			self.$_base.append(self.$_play);
			self.$_base.append(self.$_pause);

			self.setState(PlayPauseButton.STATE_PAUSED);
		}

		PlayPauseButton.STATE_PLAYING = 0;
		PlayPauseButton.STATE_PAUSED = 1;

		PlayPauseButton.prototype.setState = function (s) {
			var self = this;

			if (s == PlayPauseButton.STATE_PLAYING) {
				self.$_play.addClass('hidden');
				self.$_pause.removeClass('hidden');
			} else if (s == PlayPauseButton.STATE_PAUSED) {
				self.$_play.removeClass('hidden');
				self.$_pause.addClass('hidden');
			} else {
				throw "Invalid state: " + s + "!";
			}

			self._state = s;
		};

		PlayPauseButton.prototype.onPlay = function (f) {
			var self = this;

			self.$_play.click(f);
		};

		PlayPauseButton.prototype.onPause = function (f) {
			var self = this;

			self.$_pause.click(f);
		};

		return PlayPauseButton;
	})();

	var PlayerUI = (function () {
		function PlayerUI() {
			var self = this;

			self.$_base = $('<div class="well wide"></div>');
			self._ppbtn = new PlayPauseButton();
			self._info = $('<h3 class="cropped" style="padding-left: 6px;"></h3>');

			self.$_base.css('display', 'flex');
			self.$_base.css('align-items', 'center');

			self.$_base.append(self._ppbtn.$_base);
			self.$_base.append(self._info);

			self._ppbtn.onPlay(function () {
				self.play();
			});

			self._ppbtn.onPause(function () {
				self.pause();
			});

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
				self._info.text(msg.status.song + ' ' + time_to_s(msg.status.elapsed) + ' / ' + time_to_s(msg.status.total));
			}

			if (msg.error !== undefined) {
				self.onError(msg.error);
			}
		};

		PlayerUI.prototype.onError = function (e) {
			var self = this;

			console.log(e);
		};

		PlayerUI.prototype.play = function () {
			var self = this;

			self._con.send(CMD_RESUME);
			self._ppbtn.setState(PlayPauseButton.STATE_PLAYING);

			if (window.media_player) {
				window.media_player.play();
			}
		};

		PlayerUI.prototype.pause = function () {
			var self = this;
			
			self._con.send(CMD_PAUSE);
			self._ppbtn.setState(PlayPauseButton.STATE_PAUSED);

			if (window.media_player) {
				window.media_player.stop();
			}
		};

		return PlayerUI;
	})();

	function createMediaPlayer() {
		var p = new MediaPlayer();

		window.media_player = p;

		p.setURL($('#station_url').val());
	}

	function createPlayerInterface() {
		var ui = new PlayerUI();

		window.player_ui = ui;

		ui.register();

		$('#player_ui').append(ui.$_base);
	}

	$(function () {
		var is_loopback = (document.getElementById('player') !== undefined);

		if (is_loopback) {
			createMediaPlayer();
		}

		createPlayerInterface();
	});
})(jQuery, AsyncConnection);

