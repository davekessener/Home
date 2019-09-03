(function ($) {
	function adjustNewFolderInput() {
		var $input = $('#new_folder_name');
		var l = $($input.parent(0)[0]).height();

		$input.height(l - 3);
	}

	function addNewFolderCallback() {
		$('#new_folder_button').click(function () {
			var path = encodeURIComponent($('#path').val());
			var name = encodeURIComponent($('#new_folder_name').val());

			window.location = '/nas/new?path=' + path + '&name=' + name;
		});
	}

	$(function () {
		adjustNewFolderInput();
		addNewFolderCallback();
	});
})(jQuery);

