var main = {};

// one of: 256, 512, 1024, 2048, 4096, 8192, 16384
main.BUFFER_FILL_SIZE = 2048;

main.PERMISSION_DENIED = 1;

main.statusElement = levelElement = rateElement = null;
main.firstAudio = true;
main.prevUpdateMillis = Date.now();

main.writeStatus = function(message) {
	if (!main.statusElement) {
		main.statusElement = document.getElementById('status');
	}
	main.statusElement.innerHTML = message;
	if (window.console && window.console.log) {
		console.log(message);
	}
};

/**
 * If necessary, renames various browser-specific AudioContext variables to
 * window.AudioContext.
 */
main.renameAndCheckAudioContext = function() {
	window.AudioContext = window.AudioContext ||
			window.mozAudioContext ||
			window.webkitAudioContext ||
			window.msAudioContext ||
			window.oAudioContext;
	if (window.AudioContext) {
		return true;
	} else {
		main.writeStatus('Failure: no window.AudioContext.');
		return false;
	}
};

main.renameAndCheckGetUserMedia = function() {
	navigator.getUserMedia = navigator.getUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.msGetUserMedia ||
			navigator.oGetUserMedia;
	if (navigator.getUserMedia) {
		return true;
	} else {
		main.writeStatus('Failure: no navigator.getUserMedia.');
		return false;
	}
};

main.audioSuccessCb = function(stream) {
	main.writeStatus('Got audio stream, preparing to process...');

	var audioContext = new AudioContext();

	var sampleRate = audioContext.sampleRate;
	var bufferFiller = audioContext.createJavaScriptNode(
			main.BUFFER_FILL_SIZE,
			1 /* input channels */,
			1 /* output channels */);
	bufferFiller.onaudioprocess = main.audioProcessedCb;

	var src = audioContext.createMediaStreamSource(stream);
	src.connect(bufferFiller);
	bufferFiller.connect(audioContext.destination);
};

main.audioErrorCb = function(navigatorUserMediaError) {
	if (navigatorUserMediaError.code == main.PERMISSION_DENIED) {
		main.writeStatus('Permission denied!');
	} else {
		main.writeStatus(e);
	}
};

main.audioProcessedCb = function(audioProcessingEvent) {
	if (main.firstAudio) {
		main.firstAudio = false;
		main.writeStatus('Processing audio!');
		var table = document.getElementById('stats');
		table.style.display = 'block';
	}
	var n = audioProcessingEvent.inputBuffer.length;
	var audioData = audioProcessingEvent.inputBuffer.
			getChannelData(0 /* channel index */);
	var sum = 0;
	for (var i = 0; i < n; i++) {
		sum += Math.abs(audioData[i]);
	}
	var ave = sum / n;
	main.updateDisplayedLevel(ave);
	levels.updateDisplayedLevel(ave);
	main.updateDisplayedRate();
};

main.updateDisplayedRate = function() {
	if (main.rateElement == null) {
		main.rateElement = document.getElementById('rate');
	}
	var currentMillis = Date.now();
	var dt = currentMillis - main.prevUpdateMillis;
	main.prevUpdateMillis = currentMillis;
	main.rateElement.innerHTML = 1 / (dt / 1000);
};

main.updateDisplayedLevel = function(ave) {
	if (main.levelElement == null) {
		main.levelElement = document.getElementById('level');
	}
	main.levelElement.innerHTML = ave;
	var exceedingThreshold = levels.levelToSliderPosition(ave) >=
			levels.sliderThreshold;
	main.levelElement.style.fontWeight = exceedingThreshold ?
			'bold' : 'inherit';
};

main.initUi = function() {
	$( '#level-slider' ).slider({
		disabled: true,
		min: levels.SLIDER_MIN,
		max: levels.SLIDER_MAX,
	});
	$( '#gain-slider' ).slider({
		slide: levels.slideCb,
		min: levels.SLIDER_MIN,
		max: levels.SLIDER_MAX,
	});
};

/**
 * Gets microphone access (or fails) and starts monitoring volume level.
 */
main.init = function() {
	main.initUi();

	main.writeStatus('Checking audio libraries...');
	if (!main.renameAndCheckAudioContext()) {
		return;
	}
	if (!main.renameAndCheckGetUserMedia()) {
		return;
	}

	main.writeStatus('Requesting access to the audio system...');
	navigator.getUserMedia(
			{audio: true},
			main.audioSuccessCb,
			main.audioErrorCb);
};

window.onload = main.init;
