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

SQ.Screen.prototype.drawLayer = function drawLayer (offsetX, offsetY, layerdata, layerdatawidth, tileWidth, tileHeight, tiles, targetCtx) {
	targetCtx = targetCtx || this.ctx;
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	var maxX = Math.floor((offsetX + targetCtx.canvas.width) / tileWidth),
		maxY = Math.ceil((offsetY + targetCtx.canvas.height) / tileHeight);
	for (var x = Math.floor(offsetX / tileWidth); x < maxX; x++) {
		for (var y = Math.floor(offsetY / tileHeight); y < maxY; y++) {
			var tileNumber = Math.max(x, 0) + Math.max(y, 0) * layerdatawidth;
			if (!tiles[layerdata[tileNumber]]) {
				continue;
			}
			targetCtx.drawImage(tiles[layerdata[tileNumber]], x * tileWidth - offsetX, y * tileHeight - offsetY);
		}
	}
};

SQ.Screen.prototype.drawEntitys = function drawEntitys (entityList, offsetX, offsetY, targetCtx) {
	targetCtx = targetCtx || this.ctx;
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	for (var k = 0; k < entityList.length; k++) {
		targetCtx.drawImage(entityList[k].image, entityList[k].x - offsetX, entityList[k].y - offsetY);
	}
};

SQ.Screen.prototype.resizeHandler = function resizeHandler () {
	if (this.settings.fullScreen) {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
};