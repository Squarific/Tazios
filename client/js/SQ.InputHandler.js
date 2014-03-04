var SQ = SQ || {};

SQ.InputHandler = function InputHandler () {
	this.keypressListeners = [];
	this.keyupListeners = [];
	this.keydownListeners = [];

	this.inputListeners = {
		keypress: [],
		keyup: [],
		keydown: []
	};
	
	this.pressedKeys = {};

	document.addEventListener("keypress", this.keypressHandler.bind(this));
	document.addEventListener("keydown", this.keydownHandler.bind(this));
	document.addEventListener("keyup", this.keyupHandler.bind(this));
};

SQ.InputHandler.prototype.addKeypressListeners = function addKeypressListeners (listeners) {
	var alreadyRegistered;
	for (var l = 0; l < listeners.length; l++) {
		var alreadyRegistered = false;
		for (var currentL = 0; currentL < this.keypressListeners.length; currentL++) {
			if (this.keypressListeners[currentL] === listeners[l]) {
				alreadyRegistered = true;
			}
		}
		if (!alreadyRegistered && typeof listeners[l] === "function") {
			this.keypressListeners.push(listeners[l]);
		}
	}
};

SQ.InputHandler.prototype.addKeyupListeners = function addKeyupListeners (listeners) {
	var alreadyRegistered;
	for (var l = 0; l < listeners.length; l++) {
		var alreadyRegistered = false;
		for (var currentL = 0; currentL < this.keypressListeners.length; currentL++) {
			if (this.keyupListeners[currentL] === listeners[l]) {
				alreadyRegistered = true;
			}
		}
		if (!alreadyRegistered) {
			this.keyupListeners.push(listeners[l]);
		}
	}
};

SQ.InputHandler.prototype.addKeydownListeners = function addKeydownListeners (listeners) {
	var alreadyRegistered;
	for (var l = 0; l < listeners.length; l++) {
		var alreadyRegistered = false;
		for (var currentL = 0; currentL < this.keypressListeners.length; currentL++) {
			if (this.keydownListeners[currentL] === listeners[l]) {
				alreadyRegistered = true;
			}
		}
		if (!alreadyRegistered) {
			this.keydownListeners.push(listeners[l]);
		}
	}
};

SQ.InputHandler.prototype.registerKeyInputs = function registerKeyInputs (inputListeners) {
	for (var iL = 0; iL < inputListeners.length; iL++) {
		this.registerKeyInput(inputListeners[iL]);
	}
};

SQ.InputHandler.prototype.registerKeyInput = function registerKeyInput (inputListener) {
	if (!inputListener.callback) {
		return;
	}
	this.inputListeners[inputListener.type] = this.inputListeners[inputListener.type] || [];
	this.inputListeners[inputListener.type].push(inputListener);
};

SQ.InputHandler.prototype.keypressHandler = function keypressHandler (event) {
	var targetkey = event.which || event.keyCode || event.charCode;
	for (var k = 0; k < this.keypressListeners.length; k++) {
		this.keypressListeners[k](event);
	}
	for (var k = 0; k < this.inputListeners.keypress.length; k++) {
		if (this.inputListeners.keypress[k].key === targetkey) {
			this.inputListeners.keypress[k].callback(event);
		}
	}
};

SQ.InputHandler.prototype.keyupHandler = function keyupHandler (event) {
	var targetkey = event.which || event.keyCode || event.charCode;
	for (var k = 0; k < this.keyupListeners.length; k++) {
		this.keyupListeners[k](event);
	}
	for (var k = 0; k < this.inputListeners.keyup.length; k++) {
		if (this.inputListeners.keyup[k].key === targetkey) {
			this.inputListeners.keyup[k].callback(event);
		}
	}
	this.pressedKeys[targetkey] = false;
};

SQ.InputHandler.prototype.keydownHandler = function keydownHandler (event) {
	var targetkey = event.which || event.keyCode || event.charCode;
	for (var k = 0; k < this.keydownListeners.length; k++) {
		this.keydownListeners[k](event);
	}
	for (var k = 0; k < this.inputListeners.keydown.length; k++) {
		if (this.inputListeners.keydown[k].key === targetkey) {
			this.inputListeners.keydown[k].callback(event);
		}
	}
	this.pressedKeys[targetkey] = true;
};