var gulp  = require( 'gulp' );
var rm  = require( 'gulp-rm' );
var concat  = require( 'gulp-concat' );
var browserSync = require( 'browser-sync' );
var babel = require( 'gulp-babel' );
var fs = require( 'fs' );
var nightwatch = require( 'gulp-nightwatch' );

var postcss = require( 'gulp-postcss' );
var postcssNested = require( 'postcss-nested' );
var postcssImport = require( 'postcss-import' );
var postcssUrl = require( 'postcss-url' );
var postcssReporter = require( 'postcss-reporter' );
var cssNano = require( 'gulp-cssnano' );

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

gulp.task( 'css-build', function(){
	return gulp.src( PATHS.srcCss + '/_all.css' )
    .pipe( postcss( [ postcssNested, postcssUrl, postcssImport, postcssReporter ] ) )
    .pipe( cssNano() )
	.pipe( gulp.dest( PATHS.distCss ) )
});

gulp.task( 'module-build', function() {
    return gulp.src( [ PATHS.srcJs + SRC_FILES_GLOB ] )
        .pipe( babel({
                presets: [ 'es2015' ],
                plugins: [ 'transform-es2015-modules-amd' ],
                comments: false
            })
        )
		.pipe( concat( OUTPUT_FILE_NAME ) )
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
