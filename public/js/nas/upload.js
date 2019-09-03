(function ($) {
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
		var m = new FileUploadManager('/nas/upload', ui, makeFileUpload);

		window._upload_manager = m;

		$f.on('change', function () {
			m.onFileInputChange($f);
		});
	});
})(jQuery);

