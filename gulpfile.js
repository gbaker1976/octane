var gulp  = require( 'gulp' );
var browserSync = require( 'browser-sync' );
var fs = require( 'fs' );
var exec = require( 'child_process' ).exec;
var nightwatch = require( 'gulp-nightwatch' );

var mocha = require( 'gulp-mocha' );
var istanbul = require( 'gulp-istanbul' );
var isparta = require( 'isparta' );

var PATHS = {
	srcJs: 'src/js',
	distJs: 'dist/js',
    lib: 'lib',
    srcCss: 'src/css',
    distCss: 'dist/css',
    testJs: 'test/unit'
};

var SRC_FILES_GLOB = '/**/*';
var OUTPUT_FILE_NAME = 'octane.min.js';

gulp.task( 'start-server', function(){
    var pid = exec('node ./app.js -p 5000', function (err, stdout, stderr) {
		if ( err ) {
			console.error( 'Process exited with signal %d', err.code );
			console.log( stderr );
			process.exit();
		}

        console.log( stdout );
      });
});

gulp.task( 'workbench', [ 'start-server' ], function() {
	browserSync({
		server: './app'
		// proxy: 'http://localhost:5000',
        // port: 3000,
        // browser: 'google chrome'
	});

    gulp.watch( [ 'src/js/**/*.js' ], [ 'module-build', browserSync.reload ] );
	gulp.watch( [ 'src/css/**/*.css' ], [ 'css-build', browserSync.reload] );
	gulp.watch( [ 'views/**/*.html' ], browserSync.reload );
});

// gulp.task( 'test', function() {
//   return gulp.src('')
//     .pipe( nightwatch({
//       configFile: 'nightwatch.json'
//     }));
// });

gulp.task( 'istanbul', function(){
    return gulp.src( [ PATHS.srcJs + SRC_FILES_GLOB ] )
        .pipe( istanbul({
            instrumenter: isparta.Instrumenter,
            includeUntested: true
        }));
});

gulp.task( 'default', [ 'clean', 'module-build', 'css-build' ] );
