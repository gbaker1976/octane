'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IomNode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = require('consts');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IomNode = exports.IomNode = function () {
    _createClass(IomNode, [{
        key: 'name',
        get: function get() {
            return this.props.get(this).name;
        },
        set: function set(val) {
            return this.props.get(this).name = val;
        }
    }, {
        key: 'children',
        get: function get() {
            return this.props.get(this).children;
        },
        set: function set(val) {
            return this.props.get(this).children = val;
        }
    }, {
        key: 'type',
        get: function get() {
            return this.props.get(this).type;
        }
    }]);

    function IomNode(options) {
        _classCallCheck(this, IomNode);

        options || (options = {});
        this.props = new WeakMap([]);
        this.props.set(this, Object.assign({}, options, {
            type: options.type || _consts.consts.NODETYPES.IOM
        }));
    }

    return IomNode;
}();

;