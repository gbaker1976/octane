'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Conduit = exports.Conduit = function () {
	function Conduit(data) {
		_classCallCheck(this, Conduit);

		this.data = data;
	}

	_createClass(Conduit, [{
		key: 'setData',
		value: function setData(data) {
			var self = this;
			Object.keys(data).forEach(function (k) {
				self.data[k] = data[k];
			});
			self.handlers.forEach(function (expr, h) {
				if (expr[0](self.data)) {
					h(self.data);
				}
			});
		}
	}, {
		key: 'registerQueryHandler',
		value: function registerQueryHandler(handler) {
			for (var _len = arguments.length, queries = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				queries[_key - 1] = arguments[_key];
			}

			var self = this;
			if (!handler || !queries || !queries.length) {
				return;
			}

			if (!this.handlers) {
				this.handlers = new Map();
			}

			if (!this.handlers.has(handler)) {
				this.handlers.set(handler, []);
			}

			queries.forEach(function (q) {
				self.handlers.get(handler).push(self.compileExpressionsForHandler(q.ast.expressions, handler));
			});
		}
	}, {
		key: 'compileExpressionsForHandler',
		value: function compileExpressionsForHandler(exprs, handler) {
			var buf = '';

			exprs.forEach(function (expr) {
				var op = '';
				var join = '';
				var joinMap = {
					'and': '&&',
					'or': '||'
				};
				var opMap = {
					'equality': '==='
				};

				if (expr.joinType) {
					join = joinMap[expr.joinType];
				} else {
					join = '';
				}

				buf += ' ' + join;

				if (expr.operand) {
					op = opMap[expr.operand];
				}

				buf += [' d.', expr.leftOp, op, '"', expr.rightOp, '"'].join('');
			});

			return eval('(function(d){return (' + buf + ');});');
		}
	}]);

	return Conduit;
}();

;