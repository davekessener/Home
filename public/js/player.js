var AudioProxy = (function () {
	function AudioProxy(f) {
		var self = this;

		self._callback = f;
	}

	AudioProxy.prototype.play = function () {
		var self = this;

		if (self._callback) {
			self._player = self._callback();
			self._player.play();
		}
	};

	AudioProxy.prototype.stop = function () {
		var self = this;

		if (self._player) {
			self._player.stop();
			self._player = undefined;
		}
	};

	AudioProxy.prototype.volume = function (v) {
		var self = this;

		if (self._player) {
			return self._player.volume(v);
		}
	};

	AudioProxy.prototype.playing = function () {
		var self = this;

		if (self._player) {
			return self._player.playing();
		} else {
			return false;
		}
	};

	return AudioProxy;
})();

var MediaPlayer = (function ($) {
	function MediaPlayer() {
		var self = this;

		self.$_base = $('<audio></audio>');
		self._audio = self.$_base[0];
		self._state = MediaPlayer.STATE_STOPPED;
		self._callbacks = [];

		self._audio.loop = true;
	};

	MediaPlayer.STATE_STOPPED = 0;
	MediaPlayer.STATE_PENDING = 1;
	MediaPlayer.STATE_PLAYING = 2;

	MediaPlayer.prototype.onStateChange = function (f) {
		var self = this;

		self._callbacks.push(f);
	};

	MediaPlayer.prototype.setState = function (s) {
		var self = this;
		
		self._state = s;
		self._callbacks.forEach(function (f) {
			f(s);
		});
	};

	MediaPlayer.prototype.playing = function () {
		var self = this;

		return (self._state == MediaPlayer.STATE_PLAYING || self._state == MediaPlayer.STATE_PENDING);
	};

	MediaPlayer.prototype.url = function (url) {
		var self = this;

		if (url) {
			self._url = url;
			self.$_base.attr('src', url);
		} else {
			return self._url;
		}
	};

	MediaPlayer.prototype.volume = function (v) {
		var self = this;

		if (v) {
			self._volume = v;
			self._audio.volume = v;
		} else {
			return self._volume;
		}
	};

	MediaPlayer.prototype.play = function () {
		var self = this;

		self.setState(MediaPlayer.STATE_PENDING);
		self._audio.load();
		self._audio.play();

		var count = 10;

		function checkAudio() {
			if (self._audio.error !== null) {
				self._audio.load();
				self._audio.play();

				count -= 1;

				if (count > 0) {
					setTimeout(checkAudio, 500);
				}
			} else {
				self.setState(MediaPlayer.STATE_PLAYING);
			}
		}
		
//		setTimeout(checkAudio, 500);
	};

	MediaPlayer.prototype.stop = function () {
		var self = this;

		self._audio.pause();
		self.setState(MediaPlayer.STATE_STOPPED);
	};

	return MediaPlayer;
})(jQuery);

