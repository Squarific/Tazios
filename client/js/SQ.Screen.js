var SQ = SQ || {};

SQ.Screen = function Screen (canvas, settings) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.settings = settings;
	this.backgrounds = []; 
	
	this.resizeHandler();
	window.addEventListener("resize", this.resizeHandler.bind(this));
};

SQ.Screen.prototype.addBackgrounds = function addBackgrounds (number) {
	for (var k = 0; k < number; k++) {
		var ctx = this.newCtx(this.canvas.width * this.settings.offscreenMultiplier, this.canvas.height * this.settings.offscreenMultiplier);
		ctx.canvas.simulatedX = 0;
		ctx.canvas.simulatedY = 0;
		this.backgrounds.push(ctx.canvas);
	}
	return this;
};

SQ.Screen.prototype.drawLayer = function drawLayer (offsetX, offsetY, layerdata, layerdatawidth, tileWidth, tileHeight, tiles, targetCtx) {
	targetCtx = targetCtx || this.ctx;
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	var maxX = Math.ceil((offsetX + targetCtx.canvas.width) / tileWidth),
		maxY = Math.ceil((offsetY + targetCtx.canvas.height) / tileHeight);
	for (var x = Math.floor(offsetX / tileWidth); x < maxX; x++) {
		for (var y = Math.floor(offsetY / tileHeight); y < maxY; y++) {
			var tileNumber = Math.max(x, 0) + Math.max(y, 0) * layerdatawidth;
			if (!tiles[layerdata[tileNumber]] || x > layerdatawidth) {
				continue;
			}
			targetCtx.drawImage(tiles[layerdata[tileNumber]], x * tileWidth - offsetX, y * tileHeight - offsetY);
		}
	}
	return this;
};

SQ.Screen.prototype.drawEntitys = function drawEntitys (entityList, offsetX, offsetY, targetCtx) {
	targetCtx = targetCtx || this.ctx;
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	for (var k = 0; k < entityList.length; k++) {
		targetCtx.drawImage(entityList[k].image, entityList[k].x - offsetX, entityList[k].y - offsetY);
	}
	return this;
};

SQ.Screen.prototype.resizeHandler = function resizeHandler () {
	if (this.settings.fullScreen) {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		for (var k = 0; k < this.backgrounds.length; k++) {
			this.backgrounds[k].width = window.innerWidth * this.settings.offscreenMultiplier;
			this.backgrounds[k].height = window.innerHeight * this.settings.offscreenMultiplier;
		}
	}
};

SQ.Screen.prototype.newCtx = function (width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas.getContext("2d");
};