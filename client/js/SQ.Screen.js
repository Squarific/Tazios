var SQ = SQ || {};

SQ.Screen = function Screen (canvas, settings) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	
	if (settings.fullScreen) {
		window.addEventListener("resize", this.resizeHandler.bind(this));
	}
};

SQ.Screen.prototype.resizeHandler = function resizeHandler () {
	
};