var SQ = SQ || {};

SQ.Screen = function Screen (canvas, settings) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.settings = settings;
	
	if (settings.fullScreen) {
		window.addEventListener("resize", this.resizeHandler.bind(this));
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
};

SQ.Screen.prototype.drawLayer = function drawLayer (startX, startY, layerdata, layerdatawidth, tileWidth, tileHeight, tiles, targetCtx) {
	if (!targetCtx) {
		targetCtx = this.ctx;
	}
	var maxX = Math.floor((startX + targetCtx.canvas.width) / tileWidth),
		maxY = Math.floor((startY + targetCtx.canvas.height) / tileHeight);
	for (var x = Math.floor(startX / tileWidth); x < maxX; x++) {
		for (var y = Math.floor(startY / tileHeight); y < maxY; y++) {
			var tileNumber = Math.min(x, 0) + Math.min(y, 0) * layerdatawidth;
			targetCtx.drawImage(tiles[layerdata[tileNumber]], startX + x * tileWidth, startY + y * tileHeight);
		}
	}
};

SQ.Screen.prototype.resizeHandler = function resizeHandler () {
	if (this.settings.fullScreen) {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
};