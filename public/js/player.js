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

	MediaPlayer.prototype.setURL = function (url) {
		var self = this;

		self._url = url;
		self.$_base.attr('src', url);
	};

	MediaPlayer.prototype.play = function () {
		var self = this;

		self.setState(MediaPlayer.STATE_PENDING);
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
		
		setTimeout(checkAudio, 500);
	};

	MediaPlayer.prototype.stop = function () {
		var self = this;

		self._audio.pause();
		self.setState(MediaPlayer.STATE_STOPPED);
	};

	return MediaPlayer;
})(jQuery);

