function glyphCheckbox_set($this, value) {
	$this.prop('checked', !!value);
	$this.triggerHandler('change');
}

function glyphCheckbox_get($this) {
	return $this.is(':checked');
}

$(function () {
	$('.glyph-checkbox').each(function () {
		var $checkbox = $(this),
			$widget = $('<span />');
		
		$checkbox.addClass('hidden');
		$checkbox.prepend($widget);

		$widget.addClass('glyphicon');
		$widget.addClass('glyphicon-' + $checkbox.data('glyph'));
		$widget.css('cursor', 'pointer');
		$widget.on('click', function() {
			$checkbox.prop('checked', !$checkbox.is(':checked'));
			$checkbox.triggerHandler('change');
		});
	
		$checkbox.on('change', function() {
			update_display();
		});
	
		function update_display() {
			if($checkbox.is(':checked')) {
				$widget.css('color', '#222');
			} else {
				$widget.css('color', '#DDD');
			}
		}
	
		update_display();
	});
});

