// registry.js
export class Registry{

	constructor(){
		this._map = {};
	}

	register( type, key, handler ) {
		if ( !type ) return;

		if ( !this._map[ type ] ) {
			this._map[ type ] = [];
		}

		this._map[ type ].push({
			key: key,
			handler: handler
		});
	}

	unregister( type, key ) {
		if ( !type ) return;

		var handlers = this._map[ type ];
		var i = handlers.length-1;
		var handler;

		while( i-- ) {
			if ( key === handlers[ i ].key ) {
				this._map.splice( i, 1 );
				break;
			}
		}
	}
};
