function range(from, to, step) {
	step = (step || (from > to ? -1 : 1));

	var r = [];
	for(var i = from ; i != to ; i += step) {
		r.push(i);
	}

	return r;
}

function shuffle(a, rng) {
	rng = (rng || Math);

	var i = a.length;

	while (i !== 0) {
		var r = Math.floor(rng.random() * i);

		i -= 1;

		var t = a[i];
		a[i] = a[r];
		a[r] = t;
	}
}

function clamp(v, min, max) {
	if (min === undefined) {
		min = 0;
	}

	if (max === undefined) {
		max = 1;
	}

	if (v < min) {
		v = min;
	} else if (v > max) {
		v = max;
	}

	return v;
}

function size_to_s(s) {
	if (s < 1000) {
		return s.toFixed(0) + 'B';
	} else if (s < 1000000) {
		return (s / 1000).toFixed(1) + 'KB';
	} else if (s < 1000000000) {
		return (s / 1000000).toFixed(2) + 'MB';
	} else {
		return (s / 1000000000).toFixed(3) + 'GB';
	}
}

function time_to_s(t) {
	var h = 0, m = 0, s = 0;

	s = (t % 60);
	t = Math.floor(t / 60);
	m = (t % 60);
	t = Math.floor(t / 60);
	h = t;

	t = '' + s;

	if (s < 10) {
		t = '0' + t;
	}

	t = '' + m + ':' + t;

	if (m < 10) {
		t = '0' + t;
	}

	if (h > 0) {
		t = '' + h + ':' + t;

		if (h < 10) {
			t = '0' + t;
		}
	}

	return t;
}

