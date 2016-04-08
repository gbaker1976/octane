export class Repository {

    get data(){
        return this._data;
    };

    constructor( data ){
        this._data = data || {};
    };

    read( props ){
        var out = {};
        var i;
        var p;

        if ( typeof props === 'string' ) {
            props = [props];
        }

        for ( i = 0; i < props.length; i++ ) {
            p = props[ i ];
            out[ p ] = this._data[ p ];
        }

        return out;
    };

    defineSchema( name, otions ) {
        options = options || {};


    };

};
