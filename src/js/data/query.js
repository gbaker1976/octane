'use strict';

class Conduit {
	constructor(data){
    	this.data = data;
    };

    setData(data){
    	let self = this;
    	Object.keys(data).forEach((k) => {
            self.data[k] = data[k];
        });
        self.handlers.forEach((expr, h) => {
            if ( expr[0](self.data) ) {
                h(self.data);
            }
        });
    };

    registerQueryHandler(handler, ...queries){
    	let self = this;
    	if ( !handler || !queries || !queries.length ) {
      	return;
      }

      if ( !this.handlers ) {
      	this.handlers = new Map();
      }

      if (!this.handlers.has(handler)) {
        this.handlers.set( handler, [] );
      }

      queries.forEach((q) => {
		self.handlers.get(handler).push( self.compileExpressionsForHandler( q.ast.expressions, handler ) );
      });
    };

    compileExpressionsForHandler(exprs, handler){
        let buf = '';

    	exprs.forEach((expr) => {
            let op = '';
            let join = '';
            let joinMap = {
                'and': '&&',
              'or': '||'
            };
            let opMap = {
                'equality': '==='
            };

            if ( expr.joinType ) {
                join = joinMap[ expr.joinType ];
            } else {
                join = '';
            }

            buf += ' ' + join;

            if ( expr.operand ) {
                op = opMap[expr.operand];
            }

            buf += [' d.', expr.leftOp, op, '"', expr.rightOp, '"'].join('');
        });

        return eval( '(function(d){return (' + buf + ');});' );
    };
};

// new Query( 'name=* and dog='rover' );
class Query {
    constructor(qry) {
        qry || (qry = '');
        this.query = qry;
        this.ast = this.qry2Ast(qry);
    };

    qry2Ast(qry) {
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
            'and': function(state) {
                if (!state.inIdentifier && !state.inValue) {
                    return this._processJoinedExpression( 'and', state);
                }
            },
            'or': function(state) {
                if (!state.inIdentifier && !state.inValue) {
                    return this._processJoinedExpression( 'or', state);
                }
            }
        };

        if ( !qry ) return state.ast;

        this._createExpressionNode(void 0, state);

        for (; i < l; i++) {
            state.chr = qry.charAt(i);

            // check current char for delimiter
            if (!this._matchesDelimiters(state)) {
                state.buf += state.chr;
                // if no delimiter, move on to process operators

                // if we are not processing what we think is a value
                if (!state.inValue && state.expr && !state.expr.leftOp) {
                    state.inIdentifier = true;
                }

                // try to match current buffer on our operators
                for (token in operators) {
                    if ((new RegExp(token)).test(state.buf)) {
                        operators[token].call(this, state);
                    }
                }
            }

            if (i === l - 1) {
                state.expr = void 0;
            }
        }

        return state.ast;
    };

    // Query.merge( query1, query2, query3 );
    static merge(type, ...queries){
    	type || (type = 'and');
    	var query = new Query();

    	queries.forEach((q, i) => {
        	if ( !q || !q.ast.expressions
            		|| !q.ast.expressions.length ) {
                return;
            }
            if (i) {
            	q.ast.expressions[0].joinType = type;
            }
            Array.prototype.push.apply( query.ast.expressions, q.ast.expressions );
        });

        return query;
    };

    _matchesDelimiters(state) {
        var token = '';
        var delimiters = {
            '"': function(state) {
                if (state.inValue) {
                    state.expr.rightOp = state.buf;
                    state.buf = '';
                    state.chr = '';
                }

                state.inValue = !state.inValue;
            },
            '\s': function(state) {
                if ( state.inValue ) {
                	state.buf += state.chr;
                } else {
                	state.buf = '';
                    state.chr = '';
                    state.inIdentifier = false;
                }
            },
            '=': function(state) {
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
            if ((new RegExp(token)).test(state.chr)) {
                delimiters[token].call(this, state);
                return true;
            }
        }

        return false;
    };

    _processJoinedExpression(joinType, state) {
        state.expr = void 0;
        state.buf = '';
        state.chr = '';

        this._createExpressionNode(joinType, state);
    };

    _createExpressionNode(joinType, state) {
        state.expr = {
            joinType: joinType,
            leftOp: void 0,
            operand: void 0,
            rightOp: void 0
        };

        state.ast.expressions.push(state.expr);

        return state.expr;
    };
};

//var q = new Query('mand="foo" and porchid="rand" or flower="orchid"');
var q = Query.merge( 'or', new Query('name="fred"'), new Query('dog="rover"') );
var handler = (d) => { console.log(d.name) };
var c = new Conduit({name: 'barney'})
c.registerQueryHandler(handler, q);
c.setData({name: 'fred', dog: 'dino'});
