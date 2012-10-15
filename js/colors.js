/**
 * Represent the current level, relative to the threshold, as displayed color.
 */

var colors = {};

/**
 * Colors for sounds which are below, above, or near the threshold/target.
 */
colors.TARGET_HSL =	[120, 100, 60]; // bright green
colors.LOW_HSL =	[0, 60, 24]; // dark red
colors.HIGH_HSL =	[60, 100, 46]; // yellow

/**
 * How near the threshold/target values need to be to show up (as changes in
 * color). Range: (0.0, 1.0), where 0.0 means a narrow band of change around
 * the target, and 1.0 means change across a very wide range.
 */
colors.FALLOFF = 0.8;

/**
 * Exponent for interpolation: how quickly values will change near the
 * threshold/target color.
 */
colors.STEEPNESS = 2;

/**
 * Based on the current (smoothed) audio level, get the appropriate color.
 * @return a string for use in css
 */
colors.getColor = function(smoothedLevel) {
	var extreme;
	/**
	 * distance from target, with target = 0.0 and some value = 1.0
	 * (controlled by FALLOFF; and values beyond that > 1.0, which will be
	 * clamped later)
	 */
	var d;
	if (smoothedLevel < levels.levelThreshold) {
		d = (levels.levelThreshold - smoothedLevel) /
				(levels.levelThreshold * colors.FALLOFF);
		extreme = colors.LOW_HSL;
	} else {
		d = (smoothedLevel - levels.levelThreshold) /
				(levels.levelThreshold * (2.0-colors.FALLOFF));
		extreme = colors.HIGH_HSL;
	}
	var out = [0, 0, 0];
	for (var i = 0; i < out.length; i++) {
		out[i] = colors.interpolate(d,
				colors.TARGET_HSL[i], extreme[i]);
	}
	return 'hsl(' + out[0] + ', ' + out[1] + '%, ' + out[2] + '%)';
};

/**
 * Interpolate between origin and extreme, changing rapidly near origin and
 * slowly near extreme.
 * @param distance in the range [0.0, 1.0], a number representing how far we
 *	are from origin; argument is clamped to the range
 */
colors.interpolate = function(distance, origin, extreme) {
	var d = colors.clamp(distance, 0.0, 1.0);
	var f = 1.0 - Math.pow(1.0 - d, colors.STEEPNESS);
	return colors.lerp(f, origin, extreme);
};

colors.lerp = function(x, a, b) {
	return a + x * (b - a);
};

colors.clamp = function(x, a, b) {
	return Math.max(a, Math.min(x, b));
};
