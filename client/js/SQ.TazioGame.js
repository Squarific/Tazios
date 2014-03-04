var SQ = SQ || {};

SQ.TazioGame = function TazioGame (screenCanvas, settings) {
	this.lastUpdate = Date.now();
	this.settings = this.normalizeSettings(settings, this.defaultSettings);

	this.screen = new SQ.Screen(screenCanvas, {
		fullScreen: true
	});

	this.assetManager = new SQ.AssetManager({
		assetsToLoad: this.assetsToLoad,
		step: this.assetStep.bind(this),
		error: this.assetError.bind(this),
		success: this.assetSuccess.bind(this)
	});
	this.maxToLoad = this.assetManager.maxToLoad;

	this.loadingScreen = new SQ.LoadingScreen("blue");
	this.loadingScreen.addToDom();
};

/* Loop Management */

SQ.TazioGame.prototype.update = function update (deltaTime) {
	
};

SQ.TazioGame.prototype.draw = function draw () {
	for (var k = 0; k < this.assetManager.data.mapFile.layers.length; k++) {
		this.screen.drawLayer(0, 0, this.assetManager.data.mapFile.layers[k].data, this.assetManager.data.mapFile.layers[k].width, 32, 32, this.tileSet.tiles);
	}
};

SQ.TazioGame.prototype.loop = function loop () {
	var deltaTime = Date.now() - this.lastUpdate;
	while (deltaTime > this.settings.loopTime) {
		deltaTime -= this.settings.loopTime;
		this.lastUpdate += this.settings.loopTime;
		this.update(this.settings.loopTime);
		this.draw();
	}
	requestAnimationFrame(this.loop.bind(this));
};

/* Asset Management */

SQ.TazioGame.prototype.assetStep = function assetStep (toLoad, event) {
	this.loadingScreen.setBar((this.maxToLoad - toLoad) / this.maxToLoad);
	this.loadingScreen.setMessage((this.maxToLoad - toLoad) + "/" + this.maxToLoad + " resources loaded");
};

SQ.TazioGame.prototype.assetError = function assetError (toLoad, event) {
	this.loadingScreen.setBar((this.maxToLoad - toLoad) / this.maxToLoad);
	this.loadingScreen.setMessage("Error while loading resource! (" + (this.maxToLoad - toLoad) + "/" + this.maxToLoad + ")");
};

SQ.TazioGame.prototype.assetSuccess = function assetError () {
	console.log("Resources loaded, removing loadingScreen");
	setTimeout(function () {
		this.loadingScreen.removeFromDom();
		delete this.loadingScreen;

		this.tileSet = new SQ.TileSet();
		this.tileSet.addTileSet(17, this.assetManager.images.tiles.terrain, 32, 32);

		this.loop();
	}.bind(this), 200);
};


/* Settings */

SQ.TazioGame.prototype.normalizeSettings = function normalizeSettings (settings, defaultSettings) {
	settings = settings || {};
	for (var setting in defaultSettings) {
		if (defaultSettings[setting] === "object") {
			settings[setting] = {};
			settings[setting] = this.normalizeSettings(settings[setting], defaultSettings[setting]);
		} else {
			settings[setting] = (typeof settings[setting] === "undefined") ? defaultSettings[setting] : settings[setting];
		}
	}
	return settings;
};

/* DATA */

SQ.TazioGame.prototype.defaultSettings = {
	loopTime: 1000 / 60
};

SQ.TazioGame.prototype.assetsToLoad = {
	images: {
		tiles: {
			terrain: "images/terrain_atlas.png"
		}
	},
	jsondata: {
		mapFile: "js/mapFile.json"
	}
};

SQ.tazioGame = new SQ.TazioGame(document.getElementById("taziosscreen"));