let adapter = require('./adapter');

module.exports = ( view ) => {
	return ( req, res, next )  => {
		let html = '';
		let viewAST = require( '../data/' + view + '.json' );

		html = adapter.render( '*', viewAST );

		res.send( html );
	};
};
