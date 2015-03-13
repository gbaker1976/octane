export var Util = {
	inherit: function() {
		if ( !arguments.length ) return;
		if ( arguments.length == 1 ) return arguments[0];

		var ctors = Array.prototype.slice.call( arguments );
		var ctor = ctors.shift();
		var cproto;

		ctors.reverse();

		ctors.forEach(function( c ){
			cproto = c.prototype;
			Object.getOwnPropertyNames( cproto ).forEach( function( key ){
				ctor.prototype[ key ] = cproto[ key ];
			});
		});

		return ctor;
	}
};
