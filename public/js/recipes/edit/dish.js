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

function sortSelect(s) {
	var opt = s.find('option');
	var v = s.val();

	opt.sort(function (a, b) {
		return compare($(a).text(), $(b).text());
	});

	s.html(opt);
	s.val(v);
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

var Tag = (function () {
	function Impl(id, name) {
		var self = this;

		self._id = id;
		self._name = name;
	}

	return Impl;
})();

var ingredients = {};
var dishes = {};
var tags = {};

// ------------------------------------------------------------------------------------------------------------------------

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
	var icon_0 = 'chevron-right';
	var icon_1 = 'chevron-down';

	var panel = $(document.createElement('div'));
	var head = $(document.createElement('div'));
	var body = $(document.createElement('div'));
	var collapse = $(document.createElement('div'));
	var toggle = $(document.createElement('div'));
	var icon = makeGlyphicon(icon_0);
	var container = $(document.createElement('table'));

	panel.addClass('panel');
	panel.addClass('panel-default');

	head.addClass('panel-heading');
	body.addClass('panel-body');

	collapse.addClass('panel-collapse');
	collapse.addClass('collapse');

	toggle.data('expanded', false);
	toggle.addClass('panel-expander');
	toggle.append(icon);

	head.click(function () {
		var v = toggle.data('expanded');

		if(v) {
			icon.addClass('glyphicon-' + icon_0);
			icon.removeClass('glyphicon-' + icon_1);
			collapse.removeClass('in');
		} else {
			icon.removeClass('glyphicon-' + icon_0);
			icon.addClass('glyphicon-' + icon_1);
			collapse.addClass('in');
		}

		toggle.data('expanded', !v);
	});

	var row = $(document.createElement('tr'));
	var c_btn = $(document.createElement('td'));
	var c_h = $(document.createElement('td'));

	c_btn.append(toggle);
	c_h.append(h);
	c_h.addClass('important');

	row.append(c_btn);
	row.append(c_h);

	container.append(row);
	body.append(b);
	head.append(container);
	collapse.append(body);
	panel.append(head);
	panel.append(collapse);

	return panel;
}

function makeCompactPanel(h, b) {
	var p = makePanel(h, b);

	$(p[0].children[1].children[0]).addClass('panel-body-compact');

	return p;
}

function makeFancyField(n, v) {
	var c = $(document.createElement('div'));
	var d = $(document.createElement('span'));
	var f = $(document.createElement('input'));

	f.addClass('form-control');
	f.prop('type', 'text');

	if(v !== undefined) {
		f.prop('value', v);
	}

	d.addClass('input-group-addon');
	d.text(n);

	c.addClass('input-group');
	c.append(d);
	c.append(f);

	return c;
}

function makeNameField(v) {
	return makeFancyField($('#str_name').val(), v);
}

function makeGlyphicon(icon) {
	return $('<i class="glyphicon glyphicon-' + icon + '"></i>');
}

function makeButton(type) {
	var btn = $('<button class="btn btn-primary"></button>');

	btn.append(makeGlyphicon(type));

	return btn;
}

function makeClickSpan(icon) {
	var e = makeGlyphicon(icon);

	e.addClass('my-icon-button');
	e.addClass('my-' + icon + '-button');

	return e;
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

function makeTag(id) {
	var r = $(document.createElement('span'));

	r.addClass('badge');
	r.addClass('badge-pill');
	r.addClass('recipe-tag');

	r.data('id', id);
	r.append(tags[id]._name);
	r.append(makeGlyphicon('remove'));

	r.click(function () {
		r.remove();
	});

	return r;
}

function addFormButton(f, b_t, b_i, cb) {
	var icon = makeGlyphicon(b_i);
	var btn = $('<button class="btn btn-' + b_t + '"></button>');
	var c = $(document.createElement('div'));

	btn.append(icon);

	c.addClass('input-group-btn');
	c.append(btn);

	btn.click(cb);

	f.append(c);
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------

var ErrorPane = (function () {
	function Impl() {
		var self = this;

		self._submit  = $(document.createElement('div'));
		self._network = $(document.createElement('div'));
		self._value   = $(document.createElement('div'));

		self._value.append(self._submit);
		self._value.append(self._network);
	}

	function makeError(msg) {
		var e = $(document.createElement('div'));
		var icon = makeGlyphicon('alert');

		icon.addClass('error-sign');

		e.append(icon);
		e.append($('<span style="margin-left: 7px;"><b>' + msg + '</b></span>'));

		return e;
	}

	Impl.prototype.submitError = function (a) {
		var self = this;

		self._submit.empty();

		if(a !== undefined) {
			a.forEach(function (e) {
				self._submit.append(makeError(e));
			});
		}
	};

	Impl.prototype.networkError = function (msg) {
		var self = this;

		self._network.empty();

		if(msg !== undefined) {
			self._network.append(makeError(msg));
		}
	};

	return Impl;
})();

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

var EmbeddedEntry = (function () {
	function Impl() {
		var self = this;

		var name = makeNameField();

		addFormButton(name, 'danger', 'remove', function () {
			self._value.remove();
		});

		self._name = $(name[0].children[1]);
		self._content = new IngredientsManagerLight();
		self._value = makePanel(name, self._content._value);

		self._name.val('');
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

var IngredientsManagerLight = (function () {
	function Manager() {
		var self = this;

		self._value    = $(document.createElement('div'));
		self._base     = new BaseTable();
		self._compound = new CompoundTable();

		self._value.append(makePanel($('<h3>' + $('#str_ing_base').val() + '</h3>'), self._base._value));
		self._value.append(makePanel($('<h3>' + $('#str_ing_comp').val() + '</h3>'), self._compound._value));
	}

	Manager.prototype.getContent = function () {
		var self = this;

		return {
			base: self._base.getContent(),
			compound: self._compound.getContent(),
			embedded: []
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
	};

	return Manager;
})();

var IngredientsManager = (function () {
	function Impl() {
		var self = this;

		IngredientsManagerLight.call(self);

		self._embed = new EmbeddedManager();
		self._value.append(makePanel($('<h3>' + $('#str_ing_embed').val() + '</h3>'), self._embed._value));
	}

	Impl.prototype = Object.create(IngredientsManagerLight.prototype);
	Impl.prototype.constructor = Impl;

	Impl.prototype.getContent = function () {
		var self = this;

		var r = IngredientsManagerLight.prototype.getContent.call(self);

		r.embedded = self._embed.getContent();

		return r;
	};

	Impl.prototype.setContent = function (o) {
		var self = this;

		IngredientsManagerLight.prototype.setContent.call(self, o);

		o['embed'].forEach(function (b) {
			var e = new EmbeddedEntry();

			e.setContent(b);

			self._embed.addEntry(e);
		});
	};

	return Impl;
})();

var TagManager = (function () {
	function Impl() {
		var self = this;

		var creator = makeFancyField($('#str_tag_new').val());

		self._value = $(document.createElement('div'));
		self._tags = $(document.createElement('div'));
		self._select = makeSelect(tags);
		self._creator = $(creator[0].children[1]);

		self._tags.addClass('control-group');

		self._select.prepend($('<option value="-">---</option>'));
		self._select.val('-');
		self._select.on('change', function () {
			self.addTag(self._select.val());
		});
		self._select.addClass('control-group');

		sortSelect(self._select);

		addFormButton(creator, 'primary', 'plus', function () {
			$.post('/recipes/new/tag', { tag: self._creator.val() }, function (r) {
				if(r['error'] === undefined) {
					tags[r['id']] = new Tag(r['id'], r['name']);

					self._creator.val('');
					self.addTag(r['id']);
				} else {
					error_pane.submitError(r['error']);
				}
			}).fail(function () {
				error_pane.submitError('Network failure!');
			});
		});

		self._value.append(self._tags);
		self._value.append(self._select);
		self._value.append(creator);
	}

	Impl.prototype.addTag = function (id) {
		var self = this;

		var tag = makeTag(id);

		tag.click(function () {
			self._select.append($('<option value="' + id + '">' + tags[id]._name + '</option>'));

			sortSelect(self._select);
		});

		self._tags.append(tag);
		self._select.val('-');
		self._select.find('option[value="' + id + '"]').remove();
	};

	Impl.prototype.getContent = function () {
		var self = this;

		return Array.from(self._tags[0].children).map(function (e) {
			return +($(e).data('id'));
		});
	};

	Impl.prototype.setContent = function (o) {
		var self = this;

		o.forEach(function (id) {
			self.addTag(id);
		});
	};

	return Impl;
})();

var Manager = (function () {
	function Impl() {
		var self = this;

		var name = makeNameField();
		var submit = $('<button class="btn btn-success control-group">' + $('#str_submit').val() + '</button>');

		self._value = $(document.createElement('div'));
		self._name = $(name[0].children[1]);
		self._tags = new TagManager();
		self._ingredients = new IngredientsManager();
		self._instructions = $('<textarea class="form-control" rows="20"></textarea>');

		submit.click(function () {
			var r = self.getContent();

			window.result = r;

			$.post($('#post_url').val(), { dish: JSON.stringify(r) }, function (r) {
				if(r['error'].length === 0) {
					window.location.href = '/recipes/dish/' + r['dish'];
				} else {
					error_pane.submitError(r['error']);
				}
			}).fail(function () {
				error_pane.submitError(['Network failure!']);
			});
		});

		name.addClass('control-group');

		function heading(id) {
			return $('<h2>' + $('#str_' + id).val() + '</h2>');
		}

		self._value.append(name);
		self._value.append(makePanel(heading('tags'), self._tags._value));
		self._value.append(makePanel(heading('ing'), self._ingredients._value));
		self._value.append(makeCompactPanel(heading('ins'), self._instructions));
		self._value.append(submit);
	}

	Impl.prototype.getContent = function () {
		var self = this;

		return {
			name: self._name.val(),
			tags: self._tags.getContent(),
			ingredients: self._ingredients.getContent(),
			instructions: self._instructions.val()
		};
	};

	Impl.prototype.setContent = function (o) {
		var self = this;

		self._name.val(o['name']);
		self._tags.setContent(o['tags']);
		self._ingredients.setContent(o['ingredients']);
		self._instructions.val(o['instructions']);
	};

	return Impl;
})();

var manager = undefined;
var error_pane = new ErrorPane();
var failure_timeout = 750;

function loadIngredients(t, hash) {
	setTimeout(function () {
		$.getJSON('/recipes/ingredients', { hash: hash }, function (r) {
			error_pane.networkError();

			if(hash != r['hash']) {
				r['ingredients'].forEach(function (e) {
					ingredients[e['id']] = new Ingredient(e['id'], e['name'], e['variations']);
				});

				r['dishes'].forEach(function (e) {
					dishes[e['id']] = new Dish(e['id'], e['name']);
				});

				r['tags'].forEach(function (e) {
					tags[e['id']] = new Tag(e['id'], e['name']);
				});
			}

			hash = r['hash'];

			if(manager === undefined) {
				manager = new Manager();

				var o = $('#old_data');
		
				if(o.length) {
					manager.setContent(o.data('old'));
				}

				$('#main').empty();
				$('#main').append(manager._value);
			}

			loadIngredients(2000, hash);
		}).fail(function () {
			error_pane.networkError('Failed to retrieve data!');

			loadIngredients(failure_timeout, hash);
			
			if(failure_timeout < 10000) {
				failure_timeout = failure_timeout * 2;
			}
		});
	}, t);
}

$(function () {
	$('#error_pane').append(error_pane._value);

	loadIngredients(0, '');
});

})(jQuery);

