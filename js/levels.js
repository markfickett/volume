var levels = {};

levels.SLIDER_MIN = 0;
levels.SLIDER_MAX = 1000;
levels.SLIDER_DELTA = levels.SLIDER_MAX - levels.SLIDER_MIN;
levels.LEVEL_MULT = 10; // larger values = quiet sounds take up more slider

levels.sliderThreshold = levels.SLIDER_MIN;

/**
 * More or less log, but f(0) = 0.
 */
levels.adjustedLog = function(x) {
	return Math.log(x + Math.exp(-Math.E)) + Math.E;
};

/**
 * Maps from a (linear-scale) level value in [LEVEL_MIN, LEVEL_MAX] to a
 * (log-scale) slider value in the range [SLIDER_MIN, SLIDER_MAX].
 */
levels.levelToSliderPosition = function(level) {
	var y = levels.adjustedLog(level * levels.LEVEL_MULT) /
			levels.adjustedLog(levels.LEVEL_MULT);
	y = levels.SLIDER_MIN + levels.SLIDER_DELTA * y;
	return y;
};

levels.sliderPositionTolevel = function(pos) {
	var x = (pos - levels.SLIDER_MIN) / levels.SLIDER_DELTA;
	x = x * levels.adjustedLog(levels.MULT) - Math.E;
	x = Math.exp(x) - Math.exp(-Math.E);
	x = x / levels.LEVEL_MULT;
	return x;
};

levels.slideCb = function(event, ui) {
	levels.sliderThreshold = ui.value;
};

levels.updateDisplayedLevel = function(level) {
	var sliderValue = levels.levelToSliderPosition(level);
	$( '#level-slider' ).slider('value', sliderValue);
};
