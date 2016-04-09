define(["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

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
});define(["exports", "ui/surface"], function (exports, _surface) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Octane = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var Octane = exports.Octane = function () {
		function Octane() {
			_classCallCheck(this, Octane);
		}

		_createClass(Octane, [{
			key: "Surface",
			get: function get() {
				return _surface.Surface;
			}
		}]);

		return Octane;
	}();

	;
});define(['exports'], function (exports) {
				'use strict';

				Object.defineProperty(exports, "__esModule", {
								value: true
				});

				function _classCallCheck(instance, Constructor) {
								if (!(instance instanceof Constructor)) {
												throw new TypeError("Cannot call a class as a function");
								}
				}

				var _createClass = function () {
								function defineProperties(target, props) {
												for (var i = 0; i < props.length; i++) {
																var descriptor = props[i];
																descriptor.enumerable = descriptor.enumerable || false;
																descriptor.configurable = true;
																if ("value" in descriptor) descriptor.writable = true;
																Object.defineProperty(target, descriptor.key, descriptor);
												}
								}

								return function (Constructor, protoProps, staticProps) {
												if (protoProps) defineProperties(Constructor.prototype, protoProps);
												if (staticProps) defineProperties(Constructor, staticProps);
												return Constructor;
								};
				}();

				var Foreman = exports.Foreman = function () {
								function Foreman(script) {
												_classCallCheck(this, Foreman);

												if (!script) throw new Error('You must supply a script to execute!');
												this._script = script;

												return this;
								}

								_createClass(Foreman, [{
												key: 'start',
												value: function start() {
																this._worker = new Worker(this._script);
																this._worker.postMessage({
																				command: 'start'
																});
																return this;
												}
								}, {
												key: 'stop',
												value: function stop() {
																this._worker.postMessage({
																				command: 'stop'
																});
																return this;
												}
								}, {
												key: 'send',
												value: function send(data) {
																this._worker.postMessage({
																				command: 'data',
																				data: data
																});
																return this;
												}
								}, {
												key: 'on',
												value: function on(name, handler) {
																this._worker.addEventListener('message', function (message) {
																				if (name === message.command) {
																								handler(message.data);
																				}
																}, false);
																return this;
												}
								}, {
												key: 'off',
												value: function off(name) {
																this._worker.removeEventListener('message');
																return this;
												}
								}]);

								return Foreman;
				}();

				;
});define([], function () {
	'use strict';

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var Conduit = function () {
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
});define([], function () {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Query = function () {
        function Query(qry) {
            _classCallCheck(this, Query);

            qry || (qry = '');
            this.query = qry;
            this.ast = this.qry2Ast(qry);
        }

        _createClass(Query, [{
            key: 'qry2Ast',
            value: function qry2Ast(qry) {
                var self = this;
                var l = qry.length;
                var i = 0;
                var state = {
                    ast: {
                        expressions: []
                    },
                    inIdentifier: false,
                    inValue: false,
                    chr: '',
                    buf: '',
                    expr: void 0
                };
                var token = '';
                var operators = {
                    'and': function and(state) {
                        if (!state.inIdentifier && !state.inValue) {
                            return this._processJoinedExpression('and', state);
                        }
                    },
                    'or': function or(state) {
                        if (!state.inIdentifier && !state.inValue) {
                            return this._processJoinedExpression('or', state);
                        }
                    }
                };

                if (!qry) return state.ast;

                this._createExpressionNode(void 0, state);

                for (; i < l; i++) {
                    state.chr = qry.charAt(i);

                    if (!this._matchesDelimiters(state)) {
                        state.buf += state.chr;

                        if (!state.inValue && state.expr && !state.expr.leftOp) {
                            state.inIdentifier = true;
                        }

                        for (token in operators) {
                            if (new RegExp(token).test(state.buf)) {
                                operators[token].call(this, state);
                            }
                        }
                    }

                    if (i === l - 1) {
                        state.expr = void 0;
                    }
                }

                return state.ast;
            }
        }, {
            key: '_matchesDelimiters',
            value: function _matchesDelimiters(state) {
                var token = '';
                var delimiters = {
                    '"': function _(state) {
                        if (state.inValue) {
                            state.expr.rightOp = state.buf;
                            state.buf = '';
                            state.chr = '';
                        }

                        state.inValue = !state.inValue;
                    },
                    '\s': function s(state) {
                        if (state.inValue) {
                            state.buf += state.chr;
                        } else {
                            state.buf = '';
                            state.chr = '';
                            state.inIdentifier = false;
                        }
                    },
                    '=': function _(state) {
                        state.inIdentifier = false;

                        if (state.buf && !state.inValue) {
                            state.expr.operand = 'equality';
                            state.expr.leftOp = state.buf.trim();
                            state.buf = '';
                            state.chr = '';
                        } else {
                            throw new Error('Syntax error: equality operator missing left-hand operand.');
                        }
                    }
                };

                for (token in delimiters) {
                    if (new RegExp(token).test(state.chr)) {
                        delimiters[token].call(this, state);
                        return true;
                    }
                }

                return false;
            }
        }, {
            key: '_processJoinedExpression',
            value: function _processJoinedExpression(joinType, state) {
                state.expr = void 0;
                state.buf = '';
                state.chr = '';

                this._createExpressionNode(joinType, state);
            }
        }, {
            key: '_createExpressionNode',
            value: function _createExpressionNode(joinType, state) {
                state.expr = {
                    joinType: joinType,
                    leftOp: void 0,
                    operand: void 0,
                    rightOp: void 0
                };

                state.ast.expressions.push(state.expr);

                return state.expr;
            }
        }], [{
            key: 'merge',
            value: function merge(type) {
                type || (type = 'and');
                var query = new Query();

                for (var _len = arguments.length, queries = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    queries[_key - 1] = arguments[_key];
                }

                queries.forEach(function (q, i) {
                    if (!q || !q.ast.expressions || !q.ast.expressions.length) {
                        return;
                    }
                    if (i) {
                        q.ast.expressions[0].joinType = type;
                    }
                    Array.prototype.push.apply(query.ast.expressions, q.ast.expressions);
                });

                return query;
            }
        }]);

        return Query;
    }();

    ;

    var q = Query.merge('or', new Query('name="fred"'), new Query('dog="rover"'));
    var handler = function handler(d) {
        console.log(d.name);
    };
    var c = new Conduit({ name: 'barney' });
    c.registerQueryHandler(handler, q);
    c.setData({ name: 'fred', dog: 'dino' });
});define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

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
});define(['exports', '../ui/iom/iomnode'], function (exports, _iomnode) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Surface = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var Surface = exports.Surface = function (_IomNode) {
		_inherits(Surface, _IomNode);

		function Surface() {
			_classCallCheck(this, Surface);

			options || (options = {});

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Surface).call(this));

			if (options.conduit) {
				_this.set(options.conduit);
			}
			return _this;
		}

		_createClass(Surface, [{
			key: 'setData',
			value: function setData(data) {}
		}]);

		return Surface;
	}(_iomnode.IomNode);

	;
});define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var consts = exports.consts = {
        NODETYPES: {
            IOM: 0,
            TEXT: 1
        }
    };
});define(['exports', '../../ui/iom/iomnode', '../../ui/iom/consts'], function (exports, _iomnode, _consts) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.FormNode = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var FormNode = exports.FormNode = function (_IomNode) {
        _inherits(FormNode, _IomNode);

        function FormNode(options) {
            _classCallCheck(this, FormNode);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(FormNode).call(this, {
                type: _consts.consts.NODETYPES.IOM
            }));
        }

        return FormNode;
    }(_iomnode.IomNode);

    ;
});define(['exports', '../../ui/iom/consts'], function (exports, _consts) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.IomNode = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

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
});define(['exports', '../../ui/iom/iomnode', '../../ui/iom/consts'], function (exports, _iomnode, _consts) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TextNode = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var TextNode = exports.TextNode = function (_IomNode) {
        _inherits(TextNode, _IomNode);

        function TextNode(text) {
            _classCallCheck(this, TextNode);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextNode).call(this));

            var priv = _this.props.get(_this);
            priv.text = text;
            priv.name = 'text';
            priv.type = _consts.consts.NODETYPES.TEXT;
            return _this;
        }

        _createClass(TextNode, [{
            key: 'render',
            value: function render() {
                return this.text || '';
            }
        }, {
            key: 'text',
            get: function get() {
                return this.props.get(this).text;
            }
        }]);

        return TextNode;
    }(_iomnode.IomNode);

    ;
});define(["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var BaseRenderer = exports.BaseRenderer = function () {
		function BaseRenderer() {
			_classCallCheck(this, BaseRenderer);
		}

		_createClass(BaseRenderer, [{
			key: "translateNode",
			value: function translateNode(iomNode) {
				return null;
			}
		}]);

		return BaseRenderer;
	}();

	;
});define(['exports', '../../src/js/ui/renderers/base'], function (exports, _base) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.DomRenderer = undefined;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var DomRenderer = exports.DomRenderer = function (_BaseRenderer) {
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
});