export class Foreman {

    constructor( script ){
        if ( !script ) throw new Error( 'You must supply a script to execute!' );
		this._script = script;

		return this;
    };

    start(){
        this._worker = new Worker( this._script );
		this._worker.postMessage({
			command: 'start'
		});
		return this;
    };

    stop(){
        this._worker.postMessage({
			command: 'stop'
		});
		return this;
    };

    send( data ){
        this._worker.postMessage({
			command: 'data',
			data: data
		});
		return this;
    };

    on( name, handler ){
        this._worker.addEventListener( 'message', function( message ){
			if ( name === message.command ) {
				handler( message.data );
			}
		}, false );
		return this;
    };

    off( name ){
        this._worker.removeEventListener( 'message' );
		return this;
    };

};
