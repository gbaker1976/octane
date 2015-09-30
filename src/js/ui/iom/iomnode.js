import { consts } from '../../ui/iom/consts';

export class IomNode {

    get name() {
        return this._name;
    };

    get children() {
        return this._children
    };

    get type() {
        return this._type;
    };

    set name( val ) {
        this._name = val;
    };

    set children( val ) {
        this._children = val;
    };

	constructor( name ) {
        this.name = name;
        this.children = [];
        this._type = consts.NODETYPES.IOM;
    };

    _renderStartTag(){
        return node.name ? '<' + node.name + '>' : '';
    };

    _renderEndTag(){
        return node.name ? '</' + node.name + '>' : '';
    };

    _deepRender( iom ){
        let renderer = ( node ) => {
            let html = '';
            let i = 0;
            let n;

            switch ( node.type ) {
                case consts.NODETYPES.TEXT :
                    html = node.render();
                    break;
                default :
                    if ( node.name ) {
                        html += this._renderStartTag();
                    }

                    while ( n = node.children[ i++ ] ) {
                        html += renderer( n );
                    }

                    if ( node.name ) {
                        html += this._renderEndTag();
                    }
            }

            return html;
        };

        return renderer( iom );
    };

    render(){
        return this._deepRender( this );
    };
};
