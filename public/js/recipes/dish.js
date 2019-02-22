(function ($) {

var Notes = (function () {
	var states = [
		{ sign: 'ok', klass: 'text-success', msg: 'saved' },
		{ sign: 'alert', klass: 'text-warning', msg: 'changed' },
		{ sign: 'remove', klass: 'text-danger', msg: 'error' }
	];
	var state_ok = states[0];
	var state_changed = states[1];
	var state_error = states[2];

	function Notes(o) {
		var self = this;

		self._ref = o;
		self._state = state_ok;
	}

	function getMessage(s) {
		return $('#msg_' + s.msg).val();
	}

	function updateState(s) {
		var self = this;

		states.forEach(function (ss) {
			self._ref.removeClass(ss.klass);
		});

		self._ref.addClass(s.klass);
		self._ref.html('<span class="glyphicon glyphicon-' + s.sign + '"></span><span>' + getMessage(s) + '</span>');

		self._state = s;
	}

	function scheduleSave() {
		var self = this;

		if(self._timer !== undefined) {
			window.clearTimeout(self._timer);
		}

		self._timer = setTimeout(function () {
			saveNotes.call(self);
		}, 2000);
	}

	function onError() {
		var self = this;

		updateState.call(self, state_error);
		scheduleSave.call(self);
	}

	function saveNotes() {
		var self = this;

		self._timer = undefined;

		$.post('/recipes/dish/' + $('#dish_id').val() + '/notes', { content: $('#v_notes').val() }, function (response) {
			if (response !== undefined && response.result !== undefined && response.result) {
				updateState.call(self, state_ok);
			} else {
				onError.call(self);
			}
		}).fail(function () {
			onError.call(self);
		});
	}

	Notes.prototype.onChange = function () {
		var self = this;

		if (self._state !== state_error) {
			updateState.call(self, state_changed);
			scheduleSave.call(self);
		}
	};

	return Notes;
})();

	var state = {};

	window.notes_changed = function () {
		state.notes.onChange();
	};

	$(function () {
		state.notes = new Notes($('#w_notes'));
	});
})(jQuery);

