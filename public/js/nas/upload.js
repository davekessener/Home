(function ($) {
	function clamp(v, min, max) {
		if (min === undefined) {
			min = 0;
		}

		if (max === undefined) {
			max = 1;
		}

		if (v < min) {
			v = min;
		} else if (v > max) {
			v = max;
		}

		return v;
	}

	function size_to_s(s) {
		if (s < 1000) {
			return s.toFixed(0) + 'B';
		} else if (s < 1000000) {
			return (s / 1000).toFixed(1) + 'KB';
		} else if (s < 1000000000) {
			return (s / 1000000).toFixed(2) + 'MB';
		} else {
			return (s / 1000000000).toFixed(3) + 'GB';
		}
	}

	var ProgressBar = (function () {
		function ProgressBar() {
			var self = this;

			self.$_base = $('<div class="progress" style="width: 80%;"></div>');
			self.$_bar = $('<div class="progress-bar progress-bar-success" role="progressbar"></div>');

			self.$_base.append(self.$_bar);
		}

		ProgressBar.prototype.update = function (p) {
			var self = this;

			p = 100 * clamp(p);

			self.$_bar.css('width', p + '%');
			self.$_bar.html(p.toFixed(0) + '%');
		};

		return ProgressBar;
	})();

	// var u = new FileUpload(file);
	// u.onProgressUpdate = function (e) { ... };
	// u.onUploadDone = function (e) { ... };
	// u.onError = function (e) { ... };
	// u.send('/upload.php');
	var FileUpload = (function () {
		function makeEventHandler(self, id) {
			return function (e) {
				var f = self[id];

				if (f !== undefined && f.call != undefined) {
					f.call(self, e);
				}
			}
		}

		function FileUpload(f) {
			var self = this;

			self._file = f;
			self._data = new FormData();
			self._req = new XMLHttpRequest();

			self._data.append('file', f);

			self._req.upload.addEventListener('progress', makeEventHandler(self, 'onProgressUpdate'), false);
			self._req.addEventListener('load', makeEventHandler(self, 'onUploadDone'), false);
			self._req.addEventListener('error', makeEventHandler(self, 'onError'), false);
		}

		FileUpload.prototype.addData = function(n, d) {
			var self = this;

			self._data.append(n, d);
		};

		FileUpload.prototype.send = function(url) {
			var self = this;

			self._req.open('POST', url, true);
			self._req.send(self._data);
		};

		FileUpload.prototype.size = function () {
			var self = this;

			return self._file.size;
		};

		FileUpload.prototype.name = function () {
			var self = this;

			return self._file.name;
		};

		return FileUpload;
	})();

	var FileUploadManager = (function () {
		function FileUploadManager(url, b, ui) {
			var self = this;

			self._url = url;
			self._generator = b;
			self._ui = ui;
		}

		FileUploadManager.prototype.addFile = function (f) {
			var self = this;

			var fu = self._generator(f);

			self._ui.add(fu);

			fu.send(self._url);
		};

		FileUploadManager.prototype.onFileInputChange = function ($f) {
			var self = this;

			var files = Array.from($f[0].files);

			files.forEach(function (f) {
				self.addFile(f);
			});

			$f.val('');
		};

		return FileUploadManager;
	})();

	var FileUploadUI = (function () {
		function FileUploadUI() {
			var self = this;

			self.$_base = $('<div class="file-upload row"></div>');
			self.$_name = $('<div class="col-xs-6"></div>');
			self.$_size = $('<div class="col-xs-3"></div>');
			self.$_progress = $('<div class="col-xs-3"></div>');

			self.$_bar = new ProgressBar();

			self.$_base.append(self.$_name);
			self.$_base.append(self.$_size);
			self.$_base.append(self.$_progress);
		}

		FileUploadUI.prototype.set = function (f) {
			var self = this;

			self.$_name.html(f.name());
			self.$_size.html(size_to_s(f.size()));
		};

		FileUploadUI.prototype.updateProgress = function (p) {
			var self = this;

			self.$_bar.update(p);
			self.$_progress.html('');
			self.$_progress.append(self.$_bar.$_base);
		};

		return FileUploadUI;
	})();

	var FileUploadManagerUI = (function () {
		function FileUploadManagerUI($base) {
			var self = this;

			self.$_base = $base;
			self.$_list = $('<div class="container"></div>');

			self.$_base.prepend(self.$_list);
		}

		FileUploadManagerUI.prototype.add = function (fu) {
			var self = this;

			var ui = new FileUploadUI();

			ui.set(fu);

			self.$_list.append(ui.$_base);

			fu.onProgressUpdate = function (e) {
				ui.updateProgress(e.loaded / fu.size());
			};

			fu.onUploadDone = function (e) {
				console.log('done!');
			};

			fu.onError = function (e) {
				console.log('error:', e);
			};
		};

		return FileUploadManagerUI;
	})();

	var path = $('#the_path').val();

	function makeFileUpload(f) {
		var fu = new FileUpload(f);

		fu.addData('path', path);

		return fu;
	}

	$(function () {
		var $ui = $('#the_display');
		var $f = $('#the_file');

		var ui = new FileUploadManagerUI($ui);
		var m = new FileUploadManager('/nas/upload', makeFileUpload, ui);

		window._upload_manager = m;

		$f.on('change', function () {
			m.onFileInputChange($f);
		});
	});
})(jQuery);

