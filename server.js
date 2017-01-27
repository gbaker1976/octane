let express = require( 'express' );
let html = require( './lib/html-engine' );
let adapter = require( './lib/express-adapter' );
let app = express();
let port;

if ( '-p' === process.argv[2] ) {
	if ( process.argv[3] ) {
		port = Number( process.argv[3] );
	} else {
		console.error( 'You must specify a port number with the -p switch.' );
		console.log( 'Example: node app.js -p nnnn' );
		process.exit(1);
	}
} else { // fallback to env var
	if ( process.env.npm_package_config_port ) {
		port = Number( process.env.npm_package_config_port );
	} else {
		console.error( 'No PORT package config set!' );
		process.exit(1);
	}
}

app.engine( 'html', html );
app.set( 'view engine', 'html' );
app.use( express.static( 'dist' ) );

app.get( '/', adapter( 'index' ));

app.listen( port, () => {
	console.log( 'Mogul App listening on port: %d', port );
});
