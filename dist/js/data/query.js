'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = exports.Query = function () {
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