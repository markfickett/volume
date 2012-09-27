
function writeStatus(message) {
	if (!statusElement) {
		statusElement = document.getElementById('status');
	}
	statusElement.innerHTML = message;
	if (window.console && window.console.log) {
		console.log(message);
	}
}

/**
 * If necessary, renames various browser-specific AudioContext variables to
 * window.AudioContext.
 */
function renameAndCheckAudioContext() {
	window.AudioContext = window.AudioContext ||
			window.mozAudioContext ||
			window.webkitAudioContext ||
			window.msAudioContext ||
			window.oAudioContext;
	if (window.AudioContext) {
		return true;
	} else {
		writeStatus('Failure: no window.AudioContext.');
		return false;
	}
}

function renameAndCheckGetUserMedia() {
	navigator.getUserMedia = navigator.getUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.msGetUserMedia ||
			navigator.oGetUserMedia;
	if (navigator.getUserMedia) {
		return true;
	} else {
		writeStatus('Failure: no navigator.getUserMedia.');
		return false;
	}
}

function audioSuccessCb(stream) {
	writeStatus('Got audio stream, preparing to process...');

	var audioContext = new AudioContext();

	var sampleRate = audioContext.sampleRate;
	var bufferFiller = audioContext.createJavaScriptNode(
			BUFFER_FILL_SIZE,
			1 /* input channels */,
			1 /* output channels */);
	bufferFiller.onaudioprocess = audioProcessedCb;

	var src = audioContext.createMediaStreamSource(stream);
	src.connect(bufferFiller);
	bufferFiller.connect(audioContext.destination);
}

function audioErrorCb(navigatorUserMediaError) {
	if (navigatorUserMediaError.code == PERMISSION_DENIED) {
		writeStatus('Permission denied!');
	} else {
		writeStatus(e);
	}
}

function audioProcessedCb(audioProcessingEvent) {
	if (firstAudio) {
		firstAudio = false;
		writeStatus('Processing audio!');
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
	updateDisplayedLevel(ave);
	updateDisplayedRate();
}

function updateDisplayedRate() {
	if (rateElement == null) {
		rateElement = document.getElementById('rate');
	}
	var currentMillis = Date.now();
	var dt = currentMillis - prevUpdateMillis;
	prevUpdateMillis = currentMillis;
	rateElement.innerHTML = 1 / (dt / 1000);
}

function updateDisplayedLevel(ave) {
	if (levelElement == null) {
		levelElement = document.getElementById('level');
	}
	levelElement.innerHTML = ave;
}

/**
 * Gets microphone access (or fails) and starts monitoring volume level.
 */
function main() {
	writeStatus('Checking audio libraries...');
	if (!renameAndCheckAudioContext()) {
		return;
	}
	if (!renameAndCheckGetUserMedia()) {
		return;
	}

	writeStatus('Requesting access to the audio system...');
	navigator.getUserMedia({audio: true}, audioSuccessCb, audioErrorCb);
}

var statusElement = levelElement = rateElement = null;
var firstAudio = true;
var prevUpdateMillis = Date.now();
var BUFFER_FILL_SIZE = 2048; // one of: 256, 512, 1024, 2048, 4096, 8192, 16384
var PERMISSION_DENIED = 1;
window.onload = main;
