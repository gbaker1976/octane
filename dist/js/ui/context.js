"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = exports.Context = function () {
	function Context(conduit) {
		_classCallCheck(this, Context);

		this.conduit = conduit;

		for (var _len = arguments.length, surfaces = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			surfaces[_key - 1] = arguments[_key];
		}

		this.surfaces = surfaces;
	}

	_createClass(Context, [{
		key: "render",
		value: function render() {}
	}]);

	return Context;
}();

;