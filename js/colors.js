/**
 * Represent the current level, relative to the threshold, as displayed color.
 */

var colors = {};

/**
 * Colors for sounds which are too low, too high, or near enough the threshold.
 */
colors.COLOR_LOW = '#711';
colors.COLOR_NEAR = '#8e8';
colors.COLOR_HIGH = '#ee6';

/**
 * If a level is within a factor of NEAR of the threshold, it is considered
 * matching.
 */
colors.NEAR = 2.0;

/**
 * Based on the current (smoothed) audio level, get the appropriate color.
 */
colors.getColor = function(smoothedLevel) {
	var levelThreshold = levels.sliderPositionToLevel(
			levels.sliderThreshold);
	var c;
	if (smoothedLevel < levelThreshold / colors.NEAR) {
		return colors.COLOR_LOW;
	} else if (smoothedLevel > levelThreshold * colors.NEAR) {
		return colors.COLOR_HIGH;
	} else {
		return colors.COLOR_NEAR;
	}
};
