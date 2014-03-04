var SQ = SQ || {};

SQ.EntityManager = function () {
	this.entitys = [];
};

SQ.EntityManager.prototype.addEntity = function addEntity (entity) {
	this.entitys.push(entity);
};

SQ.EntityManager.prototype.getEntityFromUid = function getEntity (uid) {
	for (var k = 0; k < this.entitys.length; k++) {
		if (this.entitys[k].uid === uid) {
			return this.entitys[k];
		}
	}
};

SQ.EntityManager.prototype.deleteEntityFromUid = function deleteEntityFromUid (uid) {
	for (var k = 0; k < this.entitys.length; k++) {
		if (this.entitys[k].uid === uid) {
			this.entitys.splice(k, 1);
			k--;
		}
	}
};

SQ.EntityManager.prototype.deleteEntityFromReference = function deleteEntityFromReference (ref) {
	for (var k = 0; k < this.entitys.length; k++) {
		if (this.entitys[k] === ref) {
			this.entitys.splice(k, 1);
			k--;
		}
	}
};

SQ.EntityManager.prototype.moveTo = function (uid, xcoord, ycoord, time) {
	for (var k = 0; k < this.entitys.length; k++) {
		if (this.entitys[k].uid === uid) {
			this.entitys.moveTo = {x: xcoord, y: ycoord, time};
		}
	}
};

SQ.EntityManager.prototype.update = function (deltaTime) {
	//TODO: Move objects to moveTo location
};