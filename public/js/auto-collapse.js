(function($, viewport) {
	$(function() {
		$('.auto-collapse').each(function() {
			var $button = $(this);

			if($button.data('toggle') != 'collapse' || !$button.data('target')) {
				return;
			}

			var $target = $($button.data('target')),
				cond = ($button.data('condition') || '>=md');

			var do_update = function() {
				if(viewport.is(cond)) {
					if($button.is(':visible')) {
						$button.hide();
						$target.collapse('show');
					}
				} else {
					if(!$button.is(':visible')) {
						$button.show();
						$target.collapse('hide');
					}
				}
			};

			do_update();
			$(window).resize(viewport.changed(do_update, 5));
		});
	});
})(jQuery, ResponsiveBootstrapToolkit);

