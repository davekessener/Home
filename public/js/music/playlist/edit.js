(function ($) {
	function allowDrag($e, cb) {
		function f(e) {
			e.preventDefault();
		}

		$e.on('dragover', f);
		$e.on('dragenter', f);
		$e.on('drop', function (e) {
			e.preventDefault();
			if (cb !== undefined) {
				cb($e, e);
			}
		});
	}

	var PlaylistEntry = (function () {
		function PlaylistEntry(idx, $b, sid, name, pos, $p) {
			var self = this;

			self.index = idx;
			self.song_id = sid;
			self.name = name;
			self.position = pos;
			self.$base = $b;
			self.$position_indicator = $p;
		}

		return PlaylistEntry;
	})();

	var PlaylistManager = (function () {
		function PlaylistManager() {
			var self = this;

			self.$_base = $('<table class="table wide"></table');
			self.$_body = $('<tbody></tbody>');
			self._songs = [];
			self._entries = [];

			var $head = $('<thead></thead>');
			var $row = $('<tr></tr>');

			var $pos = $('<th></th>');
			var $name = $('<th class="wide"></th>');

			$pos.text($('#s_position').val());
			$name.text($('#s_name').val());

			$row.append($pos);
			$row.append($name);

			$head.append($row);

			self.$_base.append($head);
			self.$_base.append(self.$_body);
		}

		PlaylistManager.prototype.add = function (sid) {
			var self = this;

			var idx = self._entries.length;
			var name = $('#song_' + sid).data('name');
			var pos = self._songs.length;

			var $row = $('<tr></tr>');
			var $pos = $('<td class="draggable" draggable="true"></td>');
			var $name = $('<td></td>');
			var $rm = $('<td></td>');

			var $rmbtn = $('<span class="glyphicon glyphicon-remove rm-btn"></span>');

			$pos.text('' + (pos + 1));
			$name.text(name);
			$rm.append($rmbtn);

			$row.append($pos);
			$row.append($name);
			$row.append($rm);

			var entry = new PlaylistEntry(idx, $row, sid, name, pos, $pos);

			self._entries.push(entry);

			$rmbtn.click(function () {
				self._songs.splice(entry.position, 1);
				entry.$base.remove();
				self.update();
			});

			function drag_callback($e, e) {
				var data = e.originalEvent.dataTransfer;

				var from_pos = +(data.getData('text/plain'));
				var to_pos = entry.position;

				if (to_pos == from_pos) {
					return;
				}

				var from_idx = self._songs[from_pos];
				var to_idx = self._songs[to_pos];
				var from = self._entries[from_idx];
				var to = self._entries[to_idx];

				from.$base.detach();
				self._songs.splice(from_pos, 1);

				if (to_pos < from_pos) {
					from.$base.insertBefore(to.$base);
				} else {
					from.$base.insertAfter(to.$base);
				}

				self._songs.splice(to_pos, 0, from_idx);

				self.update();
			}

			allowDrag($row, drag_callback);

			$pos.on('dragstart', function (e) {
				var data = e.originalEvent.dataTransfer;

				data.setData('text/plain', entry.position);

				data.effectAllowed = 'move';
			});

			self.$_body.append($row);
			self._songs.push(idx);
		};

		PlaylistManager.prototype.update = function () {
			var self = this;

			var i = 0;
			self._songs.forEach(function (s) {
				var e = self._entries[s];

				e.position = i;
				i += 1;
				e.$position_indicator.text('' + i);
			});
		};

		PlaylistManager.prototype.compile = function () {
			var self = this;

			var songs = self._songs.map(function (idx) {
				return self._entries[idx].song_id;
			});

			console.log('SONGS:', songs);

			return songs;
		};

		return PlaylistManager;
	})();

	function createManager() {
		var $base = $('#the_playlist');
		var m = new PlaylistManager();

		window.playlist_manager = m;

		$base.append(m.$_base);
	}

	function attachButton() {
		var $save_btn = $('#button_save');

		$save_btn.click(function () {
			var d = {
				id:    $('#playlist_id').val(),
				name:  $('#playlist_name').val(),
				songs: window.playlist_manager.compile()
			};

			$.post('/music/playlist', d, function (r, status) {
				if (status == 'success') {
					window.location = '/music';
				} else {
					console.log('ERROR', status, r);
				}
			});
		});
	}

	function loadPlaylist() {
		var songs = JSON.parse($('#playlist_content').val());

		songs.forEach(function (sid) {
			window.playlist_manager.add(+(sid));
		});
	}

	$(function () {
		createManager();
		attachButton();
		loadPlaylist();
	});
})(jQuery);

