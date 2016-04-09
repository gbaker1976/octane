//babel src/js -d dist/js --plugins=[transform-es2015-modules-amd] --presets=[es2015] --comments=false && cat src/js/*.js > dist/js/octane.min.js

var babel = require( 'babel-core' );
var glob = require( 'glob-fs' )();
var fs = require( 'fs' );
var path = require( 'path' );
var buf = '';
var code = '';

glob.readdir( 'src/js/**/*.js', {}, function( err, files ){
	if (err) throw new Error( err );

	files.forEach(function( file ){
		code = fs.readFileSync( file, 'utf-8' );
		buf += babel.transform( code, {
			presets: ["es2015"],
			plugins: ["transform-es2015-modules-amd"],
			comments: false
		}).code;
	});

	fs.writeFileSync( 'dist/js/octane.js', buf );
});
