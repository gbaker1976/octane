import { consts } from '../../ui/iom/consts';

export class IomNode {

    get name() {
        return this.props.get(this).name;
    };

    get children() {
        return this.props.get(this).children;
    };

    get type() {
        return this.props.get(this).type;
    };

    set name( val ) {
		return this.props.get(this).name = val;
    };

    set children( val ) {
        return this.props.get(this).children = val;
    };

	constructor( options ) {
		options || (options = {});
		this.props = new WeakMap([]);
		this.props.set(this, Object.assign({}, options, {
			type: options.type || consts.NODETYPES.IOM
		}));
    };
};
