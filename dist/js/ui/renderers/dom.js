'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('base');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DomRenderer = function (_BaseRenderer) {
	_inherits(DomRenderer, _BaseRenderer);

	function DomRenderer(context) {
		_classCallCheck(this, DomRenderer);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DomRenderer).call(this));

		_this.context = context;
		return _this;
	}

	_createClass(DomRenderer, [{
		key: 'translateNode',
		value: function translateNode(iomNode) {
			var doc = this.context.document;
			var node;

			switch (iomNode.type) {
				case consts.NODETYPES.TEXT:
					node = doc.createTextNode(iomNode);
				case consts.NODETYPES.IOM:
					node = doc.createElement(iomNode.name);
					node = this.mapAttributes(iomNode, node);
					node = this.mapChildren(iomNode, node);
			}

			return node;
		}
	}, {
		key: 'mapAttributes',
		value: function mapAttributes(iomNode, domNode) {}
	}, {
		key: 'mapChildren',
		value: function mapChildren(iomNode, domNode) {}
	}]);

	return DomRenderer;
}(_base.BaseRenderer);

;

exports.default = DomRenderer;
module.exports = exports['default'];