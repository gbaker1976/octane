var gulp  = require( 'gulp' );
var rm  = require( 'gulp-rm' );
var concat  = require( 'gulp-concat' );
var uglify = require('gulp-uglify');
var moduleTranspile  = require( 'gulp-es6-module-transpiler' );
var transpile  = require( 'gulp-es6-transpiler' );
var formatter = require( 'es6-module-transpiler-amd-formatter' );

var PATHS = {
	src: 'src',
	dist: 'dist'
};

gulp.task( 'module-build', function() {
    return gulp.src( PATHS.src + '/**/*.js' )
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
		.pipe( uglify() )
        .pipe( gulp.dest( PATHS.dist ) );
});

gulp.task( 'clean:dist', function() {
  return gulp.src( PATHS.dist + '/**/*', { read: false })
    .pipe( rm() );
});

gulp.task( 'default', [ 'clean:dist', 'module-build' ] );
