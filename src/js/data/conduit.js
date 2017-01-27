'use strict';
/*
	var c = new Conduit({name: 'Galaga'});
	c.registerQueryHandler(
		(data) => { console.log(data.name) },
		new Query('name="Megaman"')
	);
	c.setData({name: 'Megaman'});
*/
export class Conduit {
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
