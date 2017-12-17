var on_user_selection_change;

$(function() {
	$('.list-group.checked-list-box .list-group-item').each(function() {
		var $this = $(this),
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
			if(on_user_selection_change) {
				on_user_selection_change($this);
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

function get_all_selected_users(id) {
	var users = [];

	$(id + ' li.active').each(function(idx, li) {
		users.push($(li).text());
	});

	return users;
}

