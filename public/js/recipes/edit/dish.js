(function ($) {

function sample(m, i) {
	var keys = Object.keys(m);

	return m[keys[(i || Math.floor(Math.random() * keys.length))]];
}

var Variation = (function () {
	function Variation(id, name) {
		var self = this;

		self._id = id;
		self._name = name;
	}

	return Variation;
})();

var Ingredient = (function () {
	function Ingredient(id, name, variations) {
		var self = this;

		self._id = id;
		self._name = name;
		self._variations = variations;
	}

	return Ingredient;
})();

var ingredients = {
	0 : new Ingredient('0', 'test', { 0 : new Variation('0', 'var') })
};

var BaseTable = (function () {
	var FIELD_ING = 0;
	var FIELD_VAR = 1;
	var FIELD_Q = 2;
	var FIELD_U = 3;

	function Entry(iid, vid, q, u) {
		var self = this;

		self._ingredient = iid;
		self._vid = vid;
		self._quantity = q;
		self._unit = u;
	}

	function generateRow(a, t) {
		var row = $(document.createElement('tr'));

		t = (t || 'td');

		a.forEach(function (v) {
			var e = $(document.createElement(t));

			e.append(v);
			row.append(e);
		});

		return row;
	}

	function makeButton(type) {
		return $('<button class="btn btn-primary"><span class="glyphicon glyphicon-' + type + '"></span></button>');
	}

	function ViewModel(o) {
		var self = this;

		self._ref = o;
		self._table = $(document.createElement('tbody'));

		var t = $('<table class="table table-hover table-condensed"></table>');
		var addcell = $('<td colspan="5"></td>')

		t.prepend(self._table);
		self._ref.prepend(t);

		self._table.append(generateRow([$('#str_base_super').val(), $('#str_base_sub').val(), $('#str_base_quantity').val(), $('#str_base_unit').val(), ''], 'th'));

		self._adder = $(document.createElement('tr'));
		self._adder.append(addcell);
		self._table.append(self._adder);

		var btn = makeButton('plus');
		btn.click(function () {
			var ing = sample(ingredients, 0);

			self.addRow(ing._id, sample(ing._variations, 0)._id, 0.0, -1);
		});
		addcell.append(btn);
	}

	ViewModel.prototype.addRow = function (iid, vid, q, u) {
		var self = this;

		var btn = $('<span class="glyphicon glyphicon-remove" style="color: red; cursor: pointer;"></span>');
		var row = generateRow([iid, vid, q, u, btn]);

		btn.click(function () {
			row.remove()
		});

		self._adder.before(row);
	};

	function BaseTable(o) {
		var self = this;

		var pre = [];

		if (o[0].childNodes.length > 0) {
			o[0].childNodes[0].childNodes[0].childNodes.forEach(function (row) {
				var ing_id = +(row.childNodes[0].childNodes[0].data);
				var var_id = +(row.childNodes[1].childNodes[0].data);
				var quant  = +(row.childNodes[2].childNodes[0].data);
				var unit   = +(row.childNodes[3].childNodes[0].data);

				pre.push([ing_id, var_id, quant, unit]);
			});

			o[0].childNodes[0].remove();
		}

		self._model = new ViewModel(o);

		pre.forEach(function (e) {
			self._model.addRow.apply(self._model, e);
		});
	}

	return BaseTable;
})();

$(function () {
	new BaseTable($('#base_ing'));
});

})(jQuery);

