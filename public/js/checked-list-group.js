$(function() {
	$('.list-group.checked-list-box .list-group-item').each(function() {
		var $this = $(this),
			$super = $this.closest('.checked-list'),
			$checkbox = $('<input type="checkbox" class="hidden" />'),
			settings = {
				on:  { icon: 'glyphicon glyphicon-check' },
				off: { icon: 'glyphicon glyphicon-unchecked' }
			};

		$this.css('cursor', 'pointer');
		$this.append($checkbox);

		$this.on('click', function() {
			$checkbox.prop('checked', !$checkbox.is(':checked'));
			$checkbox.triggerHandler('change');
		});

		$checkbox.on('change', function() {
			updateDisplay();
			if($super) {
				$super.triggerHandler('changeList');
			}
		});

		function updateDisplay() {
			var checked = $checkbox.is(':checked');

			$this.data('state', (checked) ? 'on' : 'off');

			$this
				.find('.state-icon')
				.removeClass()
				.addClass('state-icon ' + settings[$this.data('state')].icon);

			if(checked) {
				$this.addClass('list-group-item-success active');
			} else {
				$this.removeClass('list-group-item-success active');
			}
		}

		(function() {
			if($this.data('checked') == true) {
				$checkbox.prop('checked', true);
			}

			updateDisplay();

			if($this.find('.state-icon').length == 0) {
				$this.prepend('<span class="state-icon ' + settings[$this.data('state')].icon + '"></span>');
			}
		})();
	});
});

function checkedList_getSelected($this) {
	var r = [];

	$this.children('.list-group-item.active').each(function(idx, li) {
		r.push($(li).text());
	});

	return r;
}

function checkedList_setSelected($this, vals) {
	$this.children('.list-group-item').each(function(idx, li) {
		var isChecked = $(li).hasClass('active'),
			shouldChecked = vals.includes($(li).text());

		if(isChecked != shouldChecked) {
			$(li).triggerHandler('click');
		}
	});
}

