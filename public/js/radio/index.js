(function ($) {
	var StopButton = (function () {
		function StopButton() {
			var self = this;

			self.$_base = $('<button class="btn btn-danger col-xs-3"></button>');

			var icon = $('<span class="glyphicon glyphicon-stop"></span>');

			self.$_base.css('width', '40px');
			self.$_base.css('height', '40px');
			self.$_base.append(icon);
		}

		StopButton.prototype.click = function (f) {
			var self = this;

			self.$_base.click(f);
		};

		return StopButton;
	})();

	var Label = (function () {
		function Label() {
			var self = this;
			
			self.$_base = $('<div class="col-xs-9"></div>');
			self.$_text = $('<h2></h2>');

			self.$_text.css('padding', '0');
			self.$_text.css('margin', '0');

			self.$_base.append(self.$_text);
		}

		Label.prototype.setText = function (v) {
			var self = this;

			self.$_text.text(v);
		};

		return Label;
	})();

	var ControlPanel = (function () {
		function ControlPanel() {
			var self = this;

			self.$_base = $('<div></div>');
			self._stop = new StopButton();
			self._name = new Label();
			self._volume = new VolumeSlider($('#volume_slider'));

			var $well = $('<div class="well row"></div>');
			var $right = $('<div></div>');

			$well.css('display', 'flex');
			$well.css('align-items', 'center');

			self._volume.$_base.css('padding-left', '15px');

			$right.append(self._name.$_base);
			$right.append(self._volume.$_base);
			$well.append(self._stop.$_base);
			$well.append($right);

			self.$_base.append($well);

			self._stop.click(function () {
				self.stop();
			});

			self._volume.onChange = function (v) {
				window.volume = v;

				if (window.media_player) {
					window.media_player.volume(v);
				} else {
					$.post('/radio/volume', { volume: Math.floor(v * 100) })
				}
			};

			self._name.setText('-----');

			window.volume = self._volume.get();
		}

		ControlPanel.prototype.play = function (i) {
			var self = this;

			var s = window.radio_stations[i];

			self.stop();
			self.$_base.removeClass('hidden');
			self._name.setText(s.name);

			s.play();
		};

		ControlPanel.prototype.stop = function () {
			var self = this;

			var m = window.media_player;

			self._name.setText('-----');

			window.radio_stations.forEach(function (s) {
				s.$_base.removeClass('selected');
			});

			if (m) {
				m.stop();
			} else {
				$.post('/radio/stop');
			}
		};

		return ControlPanel;
	})();

	var Station = (function () {
		function Station($e) {
			var self = this;

			self.id = +($e.data('id'));

			var $s = $('#station_' + self.id);

			self.url = $s.data('url');
			self.name = $s.data('name');
			self.$_base = $e;
		}

		Station.prototype.play = function () {
			var self = this;

			var m = window.media_player;

			self.$_base.addClass('selected');

			if (m) {
				m.url(self.url);
				m.volume(window.volume);
				m.play();
			} else {
				$.post('/radio/play', { id: self.id, volume: window.volume });
			}
		};

		return Station;
	})();

	function attachCallbacks() {
		window.radio_stations = [];

		$('.thumbnail').each(function (i, e) {
			window.radio_stations.push(new Station($(e)));

			$(e).click(function () {
				window.media_controls.play(i);
			});
		});
	}

	function createControls() {
		var p = new ControlPanel();

		window.volume = 1;
		window.media_controls = p;

		$('#gallery').prepend(p.$_base);
	}

	function createPlayer() {
		var p = new MediaPlayer();

		window.media_player = p;

		p.onStateChange(function (state) {
		});
	}

	$(function () {
		var is_loopback = (document.getElementById('player') !== null);

		attachCallbacks();
		createControls();

		if (is_loopback) {
			createPlayer();
		}
	});
})(jQuery);

