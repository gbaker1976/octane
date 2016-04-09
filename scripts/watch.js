var browserSync = require( 'browser-sync' ).create();

browserSync.watch( 'src/css/**/*.css', function (event, file) {
	if ( event === 'change' ) {
		browserSync.reload( '*.css' );
	}
});

browserSync.watch( 'src/js/**/*.js', function (event, file) {
	if ( event === 'change' ) {
		browserSync.reload( '*.js' );
	}
});

browserSync.watch( 'views/**/*.html' ).on( 'change', browserSync.reload );

browserSync.init({
	proxy: 'http://localhost:5000',
	port: 3000,
	browser: 'google chrome'
});
