(function ($) {

var Notes = (function () {
	function Notes(o) {
		var self = this;

		self._ref = o;
	}

	function updateState(icon, msg) {
		var self = this;

		self._ref.html('<span class="glyphicon glyphicon-' + icon + '"></span><span>' + msg + '</span>');
	}

	function markChanged() {
		var self = this;

		self._ref.removeClass('text-success');
		self._ref.addClass('text-danger');
		updateState.call(self, 'remove', 'Not saved yet!');

		if(self._timer !== undefined) {
			window.clearTimeout(self._timer);
		}

		self._timer = setTimeout(function () {
			markSaved.call(self);
		}, 1000);
	}

	function markSaved() {
		var self = this;

		self._ref.removeClass('text-danger');
		self._ref.addClass('text-success');
		updateState.call(self, 'ok', 'Saved successfully!');

		self._timer = undefined;
	}

	function saveNotes() {
		var self = this;

		markSaved.call(self);
	};

	Notes.prototype.onChange = function () {
		var self = this;

		markChanged.call(self);
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

