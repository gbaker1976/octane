let express = require( 'express' );
let adapterEngine = require( './lib/adapter-engine' );
let contextBuilder = require( './lib/context-builder' );
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

app.use(contextBuilder, adapterEngine);

app.listen( port, () => {
	console.log( 'Octane listening on port: %d', port );
});
