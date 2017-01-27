'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repository = exports.Repository = function () {
    _createClass(Repository, [{
        key: 'data',
        get: function get() {
            return this._data;
        }
    }]);

    function Repository(data) {
        _classCallCheck(this, Repository);

        this._data = data || {};
    }

    _createClass(Repository, [{
        key: 'read',
        value: function read(props) {
            var out = {};
            var i;
            var p;

            if (typeof props === 'string') {
                props = [props];
            }

            for (i = 0; i < props.length; i++) {
                p = props[i];
                out[p] = this._data[p];
            }

            return out;
        }
    }, {
        key: 'defineSchema',
        value: function defineSchema(name, otions) {
            options = options || {};
        }
    }]);

    return Repository;
}();

;