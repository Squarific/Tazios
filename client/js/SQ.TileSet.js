var SQ = SQ || {};

SQ.TileSet = function TileSet () {
	this.tiles = [];
};

SQ.TileSet.prototype.addTileSet = function addTileSet (startNumber, image, tileWidth, tileHeight) {
	for (var x = 0; x < image.width; x += tileWidth) {
		for (var y = 0; y < image.height; y += tileHeight) {
			var number = startNumber + (x / tileWidth) + (y / tileHeight) * (image.width / tileWidth);
			this.addTile(number, image, x, y, tileWidth, tileHeight);
		}
	}
};

SQ.TileSet.prototype.addTile = function addTile (number, image, x, y, width, height) {
	var ctx = this.newCtx(width, height);
	ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
	this.tiles[number] = ctx.canvas;
};

SQ.TileSet.prototype.newCtx = function newCtx (width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas.getContext("2d");
};