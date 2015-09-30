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
var nightwatch = require( 'gulp-nightwatch' );
var postcss = require( 'gulp-postcss' );
var postcssNested = require( 'postcss-nested' );
var cssnext = require( 'gulp-cssnext' );
var mocha = require( 'gulp-mocha' );
var istanbul = require( 'gulp-istanbul' );
var isparta = require( 'isparta' );

require( 'babel/register' );

var PATHS = {
	srcJs: 'src/js',
	distJs: 'dist/js',
    lib: 'lib',
    srcCss: 'src/css',
    distCss: 'dist/css',
    testJs: 'test/unit'
};

var AMD_LIB_PATH = PATHS.lib + '/almond.js';
var SRC_FILES_GLOB = '/**/*';
var OUTPUT_FILE_NAME = 'octane.min.js';

gulp.task( 'css-build', function(){
	return gulp.src( PATHS.srcCss + '/_all.css' )
	.pipe( cssnext({
		compress: false
	}))
	.pipe( postcss( [ postcssNested ] ) )
	.pipe( gulp.dest( PATHS.distCss ) )
});

gulp.task( 'module-build', function() {
    return gulp.src( [ PATHS.srcJs + SRC_FILES_GLOB ] )
		.pipe(moduleTranspile({
			formatter: formatter,
			basePath: PATHS.srcJs
		}))
		.pipe(transpile({
			basePath: PATHS.srcJs,
			globals: {
				'define' : false
			}
        }))
		.pipe( concat( OUTPUT_FILE_NAME ) )
        .pipe( tap(function( file ){
            file.contents = Buffer.concat(
                [
                    new Buffer( fs.readFileSync( AMD_LIB_PATH ) ),
                    file.contents
                ]
            )
        }))
		.pipe( uglify() )
        .pipe( gulp.dest( PATHS.distJs ) );
});

gulp.task( 'clean', function() {
  return gulp.src( [ PATHS.distJs + '/**/*', PATHS.distCss + '/**/*' ], { read: false })
    .pipe( rm() );
});

gulp.task( 'src-watch', [ 'clean', 'module-build', 'css-build' ], browserSync.reload );

gulp.task( 'test', [ 'clean', 'module-build' ], function() {
	browserSync({
		server: {
			baseDir: [ 'test', 'dist' ]
		}
	});

	gulp.watch( '.' + SRC_FILES_GLOB, { cwd: 'src' }, [ 'src-watch' ] );
});

gulp.task( 'test', function() {
  return gulp.src('')
    .pipe( nightwatch({
      configFile: 'nightwatch.json'
    }));
});

gulp.task( 'unittest', function( done ) {
    return gulp.src( [ PATHS.testJs + '/**/*.js' ], {read: false} )
        .pipe( mocha(
            {
                reporter: 'spec',
                compilers: 'js:babel/register'
            }
        ));
});

gulp.task( 'istanbul', function(){
    return gulp.src( [ PATHS.srcJs + SRC_FILES_GLOB ] )
        .pipe( istanbul({
            instrumenter: isparta.Instrumenter,
            includeUntested: true
        }));
});

gulp.task( 'default', [ 'clean', 'module-build', 'css-build' ] );
