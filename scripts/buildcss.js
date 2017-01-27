//postcss --use postcss-url --use postcss-import --use postcss-mixins --use postcss-nested --use postcss-custom-properties --use postcss-reporter src/css/_all.css -o dist/css/octane.css
var postcss = require( 'postcss' );
var cssnano = require( 'cssnano' );
var postcssNested = require( 'postcss-nested' );
var postcssImport = require( 'postcss-import' );
var postcssUrl = require( 'postcss-url' );
var postcssReporter = require( 'postcss-reporter' );
var postcssMixins = require( 'postcss-mixins' );
var postcssCustomProperties = require( 'postcss-custom-properties' );
var fs = require( 'fs' );

var builder = module.exports = function ( cb ) {

	cb || (cb = function(){});

	console.log( 'building css...' );

	fs.readFile( 'src/css/_all.css', function( err, css ){
		postcss([ postcssUrl, postcssImport, postcssMixins, postcssNested, postcssCustomProperties, postcssReporter, cssnano ])
	    	.process( css, { from: 'src/css/_all.css', to: 'dist/css/octane.css' })
	    		.then(function (result) {
	        		fs.writeFileSync( 'dist/css/octane.css', result.css );
	        		if ( result.map ) {
						fs.writeFileSync('dist/css/.css.map', result.map);
					}
					cb();
	    		});
	});
}

// detect if called directly
if ( !module.parent ) {
	builder();
}
