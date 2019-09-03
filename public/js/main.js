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

