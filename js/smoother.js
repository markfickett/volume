/**
 * Smooth the calculated level over a sliding window, with sinusoidal falloff.
 */

var smoother = {};

/**
 * Size of the sliding window: how many samples to smooth over.
 */
smoother.NUM_VALUES = 20;
smoother.DT = (Math.PI / 2) / smoother.NUM_VALUES;

smoother.values = [];
for (var i = 0; i < smoother.NUM_VALUES; i++) {
	smoother.values.push(0);
}

smoother.currentIndex = 0;

/**
 * Add a value to the smoothing window and get the new smoothed value.
 */
smoother.updateAndGet = function(value) {
	smoother.currentIndex = (smoother.currentIndex + 1) %
			smoother.NUM_VALUES;
	smoother.values[smoother.currentIndex] = value;

	var t = 0;
	var sum = 0;
	for (var i = smoother.currentIndex; i >= 0; i--, t += smoother.DT) {
		sum += Math.cos(t) * smoother.values[i];
	}
	for (var i = smoother.NUM_VALUES - 1; i > smoother.currentIndex;
			i--, t += smoother.DT) {
		sum += Math.cos(t) * smoother.values[i];
	}
	return sum;
};
