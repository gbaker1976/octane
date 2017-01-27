let url = require('url');
let path = require('path');
let adapter = require('./adapter');
let astLookup = require('./ast-lookup');

module.exports = ( req, res, next ) => {
	let key;

	try {
		if ( '/' === req.url ) {
			req.url = '/index';
		}

		key = path.basename(url.parse( req.url, true ).pathname);
	} catch ( e ) {
		res.status( 400 ).send( 'Invalid page key!' );
	}

	astLookup.get( key, ( err, ast ) => {
		if (err) {
			// ENOENT
			if ( -2 === err.code ) {
				res.status( 404 ).send( 'Page not found!' );
			}
		};

		adapter.render( '*', JSON.parse(ast), (err, content) => {
			if (err) {
				res.status( 500 ).send( 'The server is having a moment...' );
			}

			res.send( content );
		});
	});
};
