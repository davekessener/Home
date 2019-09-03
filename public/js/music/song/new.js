(function ($) {
	var SongQueueView = (function () {
		function SongQueueView() {
			var self = this;

			self.$_base = $('<table class="wide"></table>');
			self._entries = [];
		}

		SongQueueView.prototype.add = function (e) {
			var self = this;

			var $e = new EntryView(e);

			self._entries.push($e);
			self.$_base.append($e.$_base);
		};

		return SongQueueView;
	})();

	var Entry = (function () {
		function addProp(self, id, d) {
			self._props[id] = d;
			self._callbacks[id] = [];

			self['on' + id + 'Change'] = function (f) {
				self._callbacks[id].push(f);
			};

			self['update' + id] = function (v) {
				self._props[id] = v;

				self._callbacks[id].forEach(function (f) {
					f(v);
				});
			};
		}

		function Entry(fn) {
			var self = this;

			self.filename = fn;
			self.progress = 0;

			self._props = {};
			self._callbacks = {};

			addProp(self, 'Id');
			addProp(self, 'Progress', 0);
		}

		return Entry;
	})();

	var EntryView = (function () {
		function EntryView(e) {
			var self = this;

			self._entry = e;
			self.$_base = $('<tr class="file-upload"></tr>');
			self._progress = new ProgressBar();

			var name = $('<td class="file-name"></td>');
			var progress = $('<td></td>');
			var actions = $('<td style="width: 20px;"></td>');

			name.text(e.filename);
			progress.append(self._progress.$_base);

			self.$_base.append(name);
			self.$_base.append(progress);
			self.$_base.append(actions);

			e.onProgressChange(function (p) {
				self._progress.update(p);
			});

			e.onIdChange(function (id) {
				actions.append($(
					'<a href="/music/song/edit/' + id + '" style="display: flex;">' +
						'<button class="btn btn-primary btn-tiny">' +
							'<span class="glyphicon glyphicon-cog"></span>' +
						'</button>' +
					'</a>'
				));
			});
		}

		return EntryView;
	})();

	var ViewAdapter = (function () {
		function ViewAdapter(ui) {
			var self = this;

			self._view = ui;
		}

		ViewAdapter.prototype.add = function (fu) {
			var self = this;

			var e = new Entry(fu.name());

			fu.onProgressUpdate = function (u) {
				e.updateProgress(clamp(u.loaded / u.total));
			};

			fu.onUploadDone = function (u) {
				console.log('INFO: ' + u.status + ' ' + u.loaded + '/' + u.total + " '" + u.response + "'");

				if (u.status == 200) {
					var r = JSON.parse(u.response);

					e.updateId(r.id);
				} else {
					console.log('ERROR!');
				}
			};

			self._view.add(e);
		};

		return ViewAdapter;
	})();

	function setupQueue() {
		var $queue = $('#songs_in_progress');
		var $f = $('#the_file');
		var ui = new SongQueueView();
		var ulm = new FileUploadManager('/music/upload', new ViewAdapter(ui));

		window.upload_manager = ulm;

		$queue.append(ui.$_base);

		$f.on('change', function () {
			ulm.onFileInputChange($f);
		});
	}

	$(function () {
		setupQueue();
	});
})(jQuery);

