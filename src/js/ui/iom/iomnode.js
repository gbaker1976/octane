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
};
