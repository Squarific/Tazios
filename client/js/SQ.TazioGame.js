var SQ = SQ || {};

SQ.TazioGame = function TazioGame (screenCanvas, settings) {
	this.lastUpdate = Date.now();
	this.settings = this.normalizeSettings(settings, this.defaultSettings);
	this.cameraOffset = {x: 0, y: 0};

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
	
	this.inputHandler = new SQ.InputHandler();
	this.entityManager = new SQ.EntityManager();
};

/* Loop Management */

SQ.TazioGame.prototype.update = function update (deltaTime, currentTime) {
	this.entityManager.update(deltaTime, currentTime);
	this.updatePlayer();
	this.updateCameraPos();
};

SQ.TazioGame.prototype.draw = function draw () {
	for (var k = 0; k < this.assetManager.data.mapFile.layers.length; k++) {
		this.screen.drawLayer(this.cameraOffset.x, this.cameraOffset.y, this.assetManager.data.mapFile.layers[k].data, this.assetManager.data.mapFile.layers[k].width, 32, 32, this.tileSet.tiles);
	}
	this.screen.drawEntitys(this.entityManager.entitys, this.cameraOffset.x, this.cameraOffset.y);
};

SQ.TazioGame.prototype.loop = function loop () {
	var deltaTime = Date.now() - this.lastUpdate;
	while (deltaTime > this.settings.loopTime) {
		deltaTime -= this.settings.loopTime;
		this.lastUpdate += this.settings.loopTime;
		this.update(this.settings.loopTime, this.lastUpdate);
	}
	this.draw();
	requestAnimationFrame(this.loop.bind(this));
};

/* Camera and player update functions */

SQ.TazioGame.prototype.updatePlayer = function updatePlayer () {
	if (!this.player.moveTo) {
		var xdir = this.inputHandler.pressedKeys["37"] ? -1 : (this.inputHandler.pressedKeys["39"]) ? 1 : 0,
			ydir = (xdir !== 0) ? 0 : this.inputHandler.pressedKeys["38"] ? -1 : (this.inputHandler.pressedKeys["40"]) ? 1 : 0;
		if (xdir === 0 && ydir === 0) {
			return;
		}
		var x = Math.min(Math.max(Math.round((this.player.x + xdir * 32) / 32) * 32, 0), 3200),
			y = Math.min(Math.max(Math.round((this.player.y + ydir * 32) / 32) * 32, 0), 3200);
		this.entityManager.moveTo(this.player, x, y, 50);
	}
};

SQ.TazioGame.prototype.updateCameraPos = function updateCameraPos () {
	this.cameraOffset.x = Math.min(Math.max(this.player.x - (this.screen.canvas.width - 32) / 2, 0), 3200 - this.screen.canvas.width);
	this.cameraOffset.y = Math.min(Math.max(this.player.y - (this.screen.canvas.height - 32) / 2, 0), 3200 - this.screen.canvas.height);
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

		this.player = this.entityManager.addEntity({
			uid: "localplayer",
			x: 256,
			y: 256,
			image: this.assetManager.images.player
		});

		this.loop();
	}.bind(this), 300);
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
		},
		player: "images/player.png"
	},
	jsondata: {
		mapFile: "js/mapFile.json"
	}
};

SQ.tazioGame = new SQ.TazioGame(document.getElementById("taziosscreen"));