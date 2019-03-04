(function ($) {

function sample(m, i) {
	var keys = Object.keys(m);

	return m[keys[(i || Math.floor(Math.random() * keys.length))]];
}

function compare(a, b) {
	var convert = function (e) {
		e = e.replace(/\u00C4/g, 'A');
		e = e.replace(/\u00E4/g, 'a');
		e = e.replace(/\u00D6/g, 'O');
		e = e.replace(/\u00F6/g, 'o');
		e = e.replace(/\u00DC/g, 'U');
		e = e.replace(/\u00FC/g, 'u');
		e = e.replace(/\u00DF/g, 's');

		return e;
	};

	return convert(a) > convert(b) ? 1 : -1;
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
		self._variations = {};
		
		variations.forEach(function (e) {
			self._variations[e['id']] = new Variation(e['id'], e['name']);

			if(e['name'] === null) {
				self._def_var = e['id'];
			}
		});

		if(self._def_var === undefined) {
			self._def_var = sample(self._variations, 0)._id;
		}
	}

	return Ingredient;
})();

var Dish = (function () {
	function Impl(id, name) {
		var self = this;

		self._id = id;
		self._name = name;
	}

	return Impl;
})();

var ingredients = {};
var dishes = {};

function makeTableRow(a, t) {
	var row = $(document.createElement('tr'));

	t = (t || 'td');

	a.forEach(function (v) {
		var e = $(document.createElement(t));

		e.append(v);
		row.append(e);
	});

	return row;
}

function makePanel(h, b) {
	var panel = $(document.createElement('div'));
	var head = $(document.createElement('div'));
	var body = $(document.createElement('div'));

	panel.addClass('panel');
	panel.addClass('panel-default');

	head.addClass('panel-heading');
	body.addClass('panel-body');

	body.append(b);
	head.append(h);
	panel.append(head);
	panel.append(body);

	return panel;
}

function makeButton(type) {
	return $('<button class="btn btn-primary"><span class="glyphicon glyphicon-' + type + '"></span></button>');
}

function makeClickSpan(icon) {
	return $('<span class="glyphicon glyphicon-' + icon + ' my-icon-button my-' + icon + '-button"></span>');
}

function makeSelect(t) {
	var keys = Object.keys(t);

	if(keys.length <= 1) {
		return $('<input type="hidden" value="' + keys[0] + '"></input>');
	} else {
		var c = $(document.createElement('select'));

		c.addClass('my-form-input');

		Object.keys(t).forEach(function (k) {
			var e = t[k];
			var o = $(document.createElement('option'));

			o.prop('value', e._id);
			o.html(e._name === null ? '---' : e._name);

			if(e._name === null) {
				o.html('---');
				o.prop('selected', 'true');
			} else {
				o.html(e._name);
			}

			c.append(o);
		});

		c.html(c.find('option').sort(function (a, b) {
			return compare($(a).text(), $(b).text());
		}));

		return c;
	}
}

function makeTextField(v) {
	return $('<input type="text" class="my-form-input" value="' + v + '"></input>');
}

// -----------------------------------------------------------------------------

var DynamicTable = (function () {
	function Impl(cols) {
		var self = this;

		self._value = $('<table class="table table-hover table-condensed table-responsive"></table>');
		self._table = $(document.createElement('tbody'));
		self._adder = $(document.createElement('tr'));

		var addcell = $('<td colspan="5"></td>')
		var btn = makeClickSpan('plus');
		var header = $(document.createElement('thead'));

		btn.click(function () {
			self.create();
		});

		cols = Array.from(cols);
		cols.push('');

		addcell.append(btn);
		header.append(makeTableRow(cols, 'th'));
		self._adder.append(addcell);
		self._table.append(self._adder);
		self._value.append(header);
		self._value.append(self._table);
	}

	Impl.prototype.addRow = function (c) {
		var self = this;

		var btn = $(document.createElement('span'));
		var btn_rm = makeClickSpan('remove');

		btn.append(btn_rm);

		c = Array.from(c);
		c.push(btn);

		var row = makeTableRow(c);

		btn.click(function () {
			row.remove();
		});

		self._adder.before(row);
	};

	Impl.prototype.get = function (e) {
		return e.val();
	};

	Impl.prototype.getContent = function () {
		var self = this;

		var a = Array.from(self._table[0].children);

		return a.slice(0, a.length - 1).map(function (row) {
			var v = Array.from(row.children).map(function (e) {
				return self.get($(e.children[0]));
			});

			return self.convert(v);
		});
	};

	return Impl;
})();

var BaseTable = (function () {
	function Impl() {
		var self = this;

		DynamicTable.call(self, (['super', 'sub', 'quantity', 'unit']).map(function (e) {
			return $('#str_base_' + e).val();
		}));
	}

	Impl.prototype = Object.create(DynamicTable.prototype);
	Impl.prototype.constructor = Impl;
	
	Impl.prototype.create = function () {
		var self = this;

		var ing = sample(ingredients, 0);

		self.addRow(ing._id, ing._def_var, '', '-');
	};

	Impl.prototype.convert = function (v) {
		return {
			ingredient: v[0],
			variation: v[1],
			quantity: v[2],
			unit: v[3]
		};
	};

	Impl.prototype.addRow = function (iid, vid, q, u) {
		var self = this;

		var ing = ingredients[iid];
		
		if(ing === undefined) {
			throw ('Unknown ingredient id ' + iid);
		}

		var sel_ing = makeSelect(ingredients);
		var sel_var = makeSelect(ing._variations);
		var sel_unit = $('#unit_select').clone();
		var quantity = makeTextField(+(q) === 0 ? '' : q);

		sel_unit.removeClass('hidden');

		sel_ing.val(ing._id);
		sel_var.val(ing._variations[vid]._id);
		sel_unit.val(u);

		sel_ing.on('change', function () {
			var ning = ingredients[sel_ing.val()];
			var sel = makeSelect(ning._variations);
			
			sel_var.replaceWith(sel);
			sel_var = sel;
		});

		DynamicTable.prototype.addRow.call(self, [sel_ing, sel_var, quantity, sel_unit]);
	};

	return Impl;
})();

var CompoundTable = (function () {
	function Impl(o) {
		var self = this;

		DynamicTable.call(self, (['dish', 'quantity', 'unit']).map(function (e) {
			return $('#str_com_' + e).val();
		}));
	}

	Impl.prototype = Object.create(DynamicTable.prototype);
	Impl.prototype.constructor = Impl;

	Impl.prototype.create = function () {
		var self = this;

		self.addRow(sample(dishes, 0)._id, '', '-');
	};

	Impl.prototype.convert = function (v) {
		var self = this;

		return {
			dish: v[0],
			quantity: v[1],
			unit: v[2]
		};
	};

	Impl.prototype.addRow = function (did, q, u) {
		var self = this;

		var dish = dishes[did];
		var sel_dish = makeSelect(dishes);
		var sel_unit = $('#unit_select').clone();
		var quantity = makeTextField(+(q) === 0 ? '' : q);

		sel_unit.removeClass('hidden');

		sel_dish.val(dish._id);
		sel_unit.val(u);

		DynamicTable.prototype.addRow.call(self, [sel_dish, quantity, sel_unit]);
	};

	return Impl;
})();

function fillTable(t, o) {
	o[0].childNodes[0].childNodes.forEach(function (row) {
		t.addRow.apply(t, Array.from(row.childNodes).map(function (e) {
			return e.childNodes[0].data;
		}));
	});

	return t;
}

function fillTableIfExists(t, o) {
	if(o[0].children.length > 0) {
		fillTable(t, $(o[0].children[0]));
	}

	return t;
}

var EmbeddedEntry = (function () {
	function Impl() {
		var self = this;

		var name = $('#f_name').clone();
		var rm = $('<button class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>');
		var container = $(document.createElement('div'));

		container.addClass('input-group-btn');
		container.append(rm);
		name.append(container);

		self._name = $(name[0].children[1]);
		self._content = new IngredientsManager();
		self._value = makePanel(name, self._content._value);

		self._value.prop('embed-ref', self);
	}

	Impl.prototype.setContent = function (o) {
		var self = this;

		self._name.val(o['name']);
		self._content.setContent(o['content']);
	};

	Impl.prototype.getContent = function () {
		var self = this;
		
		return {
			name: self._name.val(),
			content: self._content.getContent()
		};
	};

	return Impl;
})();

var EmbeddedManager = (function () {
	function Impl() {
		var self = this;

		self._value = $(document.createElement('div'));
		self._adder = makeButton('plus');

		self._value.append(self._adder);

		self._adder.click(function () {
			self.addEntry(new EmbeddedEntry());
		});
	}

	Impl.prototype.addEntry = function (e) {
		var self = this;

		self._adder.before(e._value);
	};

	Impl.prototype.getContent = function () {
		var self = this;

		var a = Array.from(self._value[0].children);

		return a.slice(0, a.length - 1).map(function (e) {
			return $(e).prop('embed-ref').getContent();
		});
	};

	return Impl;
})();

var IngredientsManager = (function () {
	function Manager() {
		var self = this;

		self._value    = $(document.createElement('div'));
		self._base     = new BaseTable();
		self._compound = new CompoundTable();
		self._embed    = new EmbeddedManager();

		self._value.append(makePanel($('<h3>' + $('#str_ing_base').val() + '</h3>'), self._base._value));
		self._value.append(makePanel($('<h3>' + $('#str_ing_embed').val() + '</h3>'), self._embed._value));
		self._value.append(makePanel($('<h3>' + $('#str_ing_comp').val() + '</h3>'), self._compound._value));
	}

	Manager.prototype.getContent = function () {
		var self = this;

		return {
			base: self._base.getContent(),
			compound: self._compound.getContent(),
			embedded: self._embed.getContent()
		};
	};

	Manager.prototype.setContent = function(o) {
		var self = this;

		o['base'].forEach(function (b) {
			self._base.addRow(+(b['ingredient']), +(b['variation']), (b['quantity'] || '0'), (b['unit'] || '-'));
		});

		o['compound'].forEach(function (b) {
			self._compound.addRow(+(b['dish']), (b['quantity'] || '0'), (b['unit'] || '-'));
		});

		o['embed'].forEach(function (b) {
			var e = new EmbeddedEntry();

			e.setContent(b);

			self._embed.addEntry(e);
		});
	};

	return Manager;
})();

var manager = undefined;

function loadIngredients(t, hash) {
	setTimeout(function () {
		$.getJSON('/recipes/ingredients', { hash: hash }, function (r) {
			if(r['ingredients'] !== undefined) {
				r['ingredients'].forEach(function (e) {
					ingredients[e['id']] = new Ingredient(e['id'], e['name'], e['variations']);
				});
			}

			if(r['dishes'] !== undefined) {
				r['dishes'].forEach(function (e) {
					dishes[e['id']] = new Dish(e['id'], e['name']);
				});
			}

			if(r['hash'] !== undefined) {
				hash = r['hash']
			}

			if(manager === undefined) {
				manager = new IngredientsManager();

				var o = $('#old_data');
		
				if(o.length) {
					manager.setContent(o.data('old'));
				}

				$('#ingredients').append(manager._value);

				$('#submit_btn').click(function () {
					var r = {
						name: $('#v_name').val(),
						ingredients: manager.getContent(),
						instructions: $('#v_instructions').val()
					};

					window.result = r;

					$.post($('#post_url').val(), { dish: JSON.stringify(r) }, function (r) {
						$('#error_pane').text('');

						if(r['error'].length === 0) {
							window.location.href = '/recipes/dish/' + r['dish'];
						} else {
							r['error'].forEach(function (e) {
								$('#error_pane').append($('<p>' + e + '</p>'));
							});
						}
					}).fail(function () {
						$('#error_pane').append('Network failure!');
					});
				});
			}

			loadIngredients(2000, hash);
		}).fail(function () {
			$('#error_pane').append('Failed to retrieve data!');

//			loadIngredients(1000, hash);
		});
	}, t);
}

$(function () {
	loadIngredients(0, '');
});

})(jQuery);

