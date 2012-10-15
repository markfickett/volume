var levels = {};

levels.SLIDER_MIN = 0;

/**
 * Arbitrary maximum value for sliders, to provide a scale.
 */
levels.SLIDER_MAX = 1000;
levels.SLIDER_DELTA = levels.SLIDER_MAX - levels.SLIDER_MIN;

levels.SLIDER_DEFAULT = 50;

/**
 * The curve of the interpolation.
 * Larger values mean quiet sounds take up more of the slider.
 */
levels.LOG_WINDOW = 10;

/**
 * Premultiplier for level values: input volume adjustment.
 */
levels.GAIN = 0.2;

levels.sliderThreshold = levels.SLIDER_DEFAULT;

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
	var y = levels.adjustedLog(level * levels.GAIN * levels.LOG_WINDOW) /
			levels.adjustedLog(levels.LOG_WINDOW);
	y = levels.SLIDER_MIN + levels.SLIDER_DELTA * y;
	return y;
};

levels.sliderPositionToLevel = function(pos) {
	var x = (pos - levels.SLIDER_MIN) / levels.SLIDER_DELTA;
	x = x * levels.adjustedLog(levels.LOG_WINDOW) - Math.E;
	x = Math.exp(x) - Math.exp(-Math.E);
	x = (x / levels.LOG_WINDOW) / levels.GAIN;
	return x;
};

levels.slideCb = function(event, ui) {
	levels.sliderThreshold = ui.value;
	levels.setLevelThresholdFromSliderThreshold();
};

levels.setLevelThresholdFromSliderThreshold = function() {
	levels.levelThreshold = levels.sliderPositionToLevel(
			levels.sliderThreshold);
};

levels.updateDisplayedLevel = function(level) {
	var sliderValue = levels.levelToSliderPosition(level);
	$( '#level-slider' ).slider('value', sliderValue);
};

levels.setLevelThresholdFromSliderThreshold();
