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
 * Adds a value to the smoothing window and gets the new weighted average.
 */
smoother.updateAndGet = function(value) {
	smoother.currentIndex = (smoother.currentIndex + 1) %
			smoother.NUM_VALUES;
	smoother.values[smoother.currentIndex] = value;

	// Since this uses a cosine falloff, and the integral of cosine from
	// 0 to PI/2 is 1.0, we can multiply each value's contribution by
	// our dt so that the overall weight sums to 1. Thus our smoothed value
	// remains in the correct range.
	var t = 0;
	var sum = 0;
	for (var i = smoother.currentIndex; i >= 0; i--, t += smoother.DT) {
		sum += Math.cos(t) * smoother.values[i] * smoother.DT;
	}
	for (var i = smoother.NUM_VALUES - 1; i > smoother.currentIndex;
			i--, t += smoother.DT) {
		sum += Math.cos(t) * smoother.values[i] * smoother.DT;
	}
	return sum;
};
