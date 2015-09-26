var gulp  = require( 'gulp' );
var rm  = require( 'gulp-rm' );
var concat  = require( 'gulp-concat' );
var uglify = require('gulp-uglify');
var browserSync = require( 'browser-sync' );
var moduleTranspile  = require( 'gulp-es6-module-transpiler' );
var transpile  = require( 'gulp-es6-transpiler' );
var formatter = require( 'es6-module-transpiler-amd-formatter' );
var tap = require( 'gulp-tap' );
var fs = require( 'fs' );

var PATHS = {
	src: 'src',
	dist: 'dist',
    lib: 'lib'
};

var AMD_LIB_PATH = PATHS.lib + '/almond.js';
var SRC_FILES_GLOB = '/**/*.js';

gulp.task( 'module-build', function() {
    return gulp.src( [ PATHS.src + SRC_FILES_GLOB ] )
		.pipe(moduleTranspile({
			formatter: formatter,
			basePath: PATHS.src
		}))
		.pipe(transpile({
			basePath: PATHS.src,
			globals: {
				'define' : false
			}
        }))
		.pipe( concat( 'octane.min.js' ) )
        .pipe( tap(function( file ){
            file.contents = Buffer.concat(
                [
                    new Buffer( fs.readFileSync( AMD_LIB_PATH ) ),
                    file.contents
                ]
            )
        }))
		.pipe( uglify() )
        .pipe( gulp.dest( PATHS.dist ) );
});

gulp.task( 'clean-dist', function() {
  return gulp.src( PATHS.dist + '/**/*', { read: false })
    .pipe( rm() );
});

gulp.task( 'src-watch', [ 'clean-dist', 'module-build' ], browserSync.reload );

gulp.task( 'test', [ 'clean-dist', 'module-build' ], function() {
	browserSync({
		server: {
			baseDir: [ 'test', 'dist' ]
		}
	});

	gulp.watch( '.' + SRC_FILES_GLOB, { cwd: 'src' }, [ 'src-watch' ] );
});

gulp.task( 'default', [ 'clean-dist', 'module-build', 'test' ] );
