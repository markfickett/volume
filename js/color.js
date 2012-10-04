/**
 * Represent the current level, relative to the threshold, as displayed color.
 */

var color = {};

color.displayElement = null;

/**
 * Colors for sounds which are too low, too high, or near enough the threshold.
 */
color.COLOR_LOW = '#711';
color.COLOR_NEAR = '#8e8';
color.COLOR_HIGH = '#ee6';

/**
 * If a level is within a factor of NEAR of the threshold, it is considered
 * matching.
 */
color.NEAR = 2.0;

/**
 * Based on the current (smoothed) audio level, update the displayed color.
 */
color.updateDisplayedColor = function(smoothedLevel) {
	if (color.displayElement == null) {
		color.displayElement = document.body;
	}

	var levelThreshold = levels.sliderPositionToLevel(
			levels.sliderThreshold);
	var c;
	if (smoothedLevel < levelThreshold / color.NEAR) {
		c = color.COLOR_LOW;
	} else if (smoothedLevel > levelThreshold * color.NEAR) {
		c = color.COLOR_HIGH;
	} else {
		c = color.COLOR_NEAR;
	}
	color.displayElement.style.background = c;
};
