//babel src/js -d dist/js --plugins=[transform-es2015-modules-amd] --presets=[es2015] --comments=false && cat src/js/*.js > dist/js/octane.min.js

var babel = require( 'babel-core' );
var glob = require( 'glob-fs' )();
var fs = require( 'fs' );
var path = require( 'path' );
var fsExtra = require( 'fs-extra' );
var webpack = require( 'webpack' );
var buf = '';
var code = '';

var builder = module.exports = function ( cb ) {

	cb || (cb = function(){});

	console.log( 'building js...' );

	glob.readdir( 'src/js/**/*.js', {}, function( err, files ){
		var fileCount = files.count;
		var newPath;

		if (err) throw new Error( err );

		files.forEach(function( file ){
			if (!file) {
				return;
			}

			code = fs.readFileSync( file, 'utf-8' );
			code = babel.transform( code, {
				presets: ["es2015"],
				plugins: [
					"babel-plugin-add-module-exports"
				],
				comments: false
			}).code;

			newPath = file.replace( 'src/', 'dist/' );

			fsExtra.ensureDirSync( path.dirname( newPath ) );

			console.log(newPath);

			fs.writeFileSync( newPath, code );
		});

		webpack({
			entry: './dist/js/octane.js',
			output: {
				path: './dist/js',
				filename: 'octane.min.js'
			}
		}, function(err, stats){
			if (err) throw new Error( err );

			console.log(stats.toString());

			cb();
		});
	});
}

// detect if called directly
if ( !module.parent ) {
	builder();
}
