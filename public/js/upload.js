var ProgressBar = (function () {
	function ProgressBar() {
		var self = this;

		self.$_base = $('<div class="progress"></div>');
		self.$_bar = $('<div class="progress-bar progress-bar-success" role="progressbar"></div>');

		self._show_text = true;

		self.$_base.append(self.$_bar);
	}

	ProgressBar.prototype.showText = function (b) {
		var self = this;

		self._show_text = b;
	};

	ProgressBar.prototype.update = function (p) {
		var self = this;

		p = 100 * clamp(p);

		self.$_bar.css('width', p + '%');

		if (self._show_text) {
			self.$_bar.html(p.toFixed(0) + '%');
		}
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
				e.request = self;
				e.status = self._req.status;
				e.response = self._req.response;

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
	function defaultFileUpload(f) {
		return new FileUpload(f);
	}

	function FileUploadManager(url, ui, b) {
		var self = this;

		self._url = url;
		self._generator = (b || defaultFileUpload);
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

		self.$_base = $('<tr class="file-upload"></tr>');
		self.$_name = $('<td class="file-name"></td>');
		self.$_size = $('<td></td>');
		self.$_progress = $('<td></td>')

		self.$_bar = new ProgressBar();

		self.$_progress.append(self.$_bar.$_base);

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
	};

	return FileUploadUI;
})();

var FileUploadManagerUI = (function () {
	function FileUploadManagerUI($base) {
		var self = this;

		self.$_base = $base;
		self.$_list = $('<table class="wide"></table>');

		self.$_base.prepend(self.$_list);
	}

	FileUploadManagerUI.prototype.add = function (fu) {
		var self = this;

		var ui = new FileUploadUI();

		ui.set(fu);

		self.$_list.append(ui.$_base);

		fu.onProgressUpdate = function (e) {
			ui.updateProgress(e.loaded / e.total);
		};
	};

	return FileUploadManagerUI;
})();


