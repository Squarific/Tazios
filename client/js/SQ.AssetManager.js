var SQ = SQ || {};

SQ.AssetManager = function AssetManager (settings) {
	this.settings = settings;
	this.images = {};
	
	this.settings.step = (typeof this.settings.step === "function") ? this.settings.step : function () {};
	this.settings.success = (typeof this.settings.success === "function") ? this.settings.success : function () {};

	if (this.settings.assetsToLoad) {
		this.imagesToLoad = this.getLoadCount(this.settings.assetsToLoad.images);
		this.loadImages(this.images, this.settings.assetsToLoad.images);
	}
};

SQ.AssetManager.prototype.getLoadCount = function getLoadCount (assets) {
	if (typeof assets !== "object") {
		return 1;
	}
	var toLoad = 0;
	for (var assetName in assets) {
		if (assets.hasOwnProperty(assetName)) {
			toLoad += this.getLoadCount(assets[assetName]);
		}
	}
	return toLoad;
};

SQ.AssetManager.prototype.loadImages = function loadImages (loadTo, loadImages) {
	for (var imageName in loadImages) {
		if (typeof loadImages[imageName] === "object") {
			loadTo[imageName] = {};
			this.loadImages(loadTo[imageName], loadImages[imageName]);
		} else {
			loadTo[imageName] = new Image();
			loadTo[imageName].addEventListener("load", this.imageLoadHandler.bind(this));
			loadTo[imageName].addEventListener("error", this.imageErrorHandler.bind(this));
			loadTo[imageName].src = loadImages[imageName];
		}
	}
};

SQ.AssetManager.prototype.imageLoadHandler = function imageLoadHandler (event) {
	this.imagesToLoad--;
	this.settings.step(this.imagesToLoad, event);
	(this.imagesToLoad === 0) ? this.settings.success() : "";
};

SQ.AssetManager.prototype.imageErrorHandler = function imageErrorHandler (event) {
	this.imagesToLoad--;
	this.settings.error(this.imagesToLoad, event);
	(this.imagesToLoad === 0) ? this.settings.success() : "";
};