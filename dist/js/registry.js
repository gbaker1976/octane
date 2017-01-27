"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Registry = exports.Registry = function () {
	function Registry() {
		_classCallCheck(this, Registry);

		this._map = {};
	}

	_createClass(Registry, [{
		key: "register",
		value: function register(type, key, handler) {
			if (!type) return;

			if (!this._map[type]) {
				this._map[type] = [];
			}

			this._map[type].push({
				key: key,
				handler: handler
			});
		}
	}, {
		key: "unregister",
		value: function unregister(type, key) {
			if (!type) return;

			var handlers = this._map[type];
			var i = handlers.length - 1;
			var handler;

			while (i--) {
				if (key === handlers[i].key) {
					this._map.splice(i, 1);
					break;
				}
			}
		}
	}]);

	return Registry;
}();

;