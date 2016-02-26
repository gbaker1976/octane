export class DataProvider {
    constructor( data ){
        this._data = (data || {} );
        this._map = new WeakMap([]);
        this._keys = [];
    };

    bind( listener ){
        this._keys[ listener ];
        this._map.set( listener, '' );
    };

    _iterateListenersForDataUpdate( changedData ){
        var i = 0;
        var o;
        for (; i < this._keys.length; i++ ) {
            o = this._map[ this._keys[ i ] ];
            if ( o ) {
                if ( o.onChange ) {
                    o.onChange( changedData );
                } else {
                    throw new Error( 'Listener does not expose onChange handler!' );
                }
            } else{
                delete this._keys[ l ];
            }
        }
    };

    setData( name, value ){
        if ( this._data[ name ] && this._data[ name ] !== value ) {
            this._data[ name ] = value;

            this._iterateListenersForDataUpdate( (({})[ name ] = value) );
        }
    };

    data(){
        return this._data;
    };
};
