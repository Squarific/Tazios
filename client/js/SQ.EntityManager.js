var SQ = SQ || {};

SQ.EntityManager = function () {
	this.entitys = [];
};

SQ.EntityManager.prototype.addEntity = function addEntity (entity) {
	this.entitys.push(entity);
	return entity;
};

SQ.EntityManager.prototype.getEntityFromUid = function getEntityFromUid (uid) {
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

SQ.EntityManager.prototype.moveTo = function (entity, xcoord, ycoord, duration) {
	duration = duration || 0;
	if (typeof entity === "string") {
		entity = this.getEntityFromUid(entity);
	}
	entity.moveTo = {
		from: {
			x: entity.x,
			y: entity.y
		},
		to: {
			x: xcoord,
			y: ycoord
		},
		duration: duration,
		startTime: Date.now()
	};
};

SQ.EntityManager.prototype.update = function (deltaTime, currentTime) {
	for (var k = 0; k < this.entitys.length; k++) {
		if (this.entitys[k].moveTo) {
			var relativeTimeTraveled = (currentTime - this.entitys[k].moveTo.startTime) / this.entitys[k].moveTo.duration;
			if (relativeTimeTraveled >= 1) {
				this.entitys[k].x = this.entitys[k].moveTo.to.x;
				this.entitys[k].y = this.entitys[k].moveTo.to.y;
				delete this.entitys[k].moveTo;
				continue;
			}
			this.entitys[k].x = this.entitys[k].moveTo.from.x + (this.entitys[k].moveTo.to.x - this.entitys[k].moveTo.from.x) * relativeTimeTraveled;
			this.entitys[k].y = this.entitys[k].moveTo.from.y + (this.entitys[k].moveTo.to.y - this.entitys[k].moveTo.from.y) * relativeTimeTraveled;
		}
	}
};