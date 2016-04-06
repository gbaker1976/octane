import { IomNode } from '../ui/iom/iomnode';

export class Surface extends IomNode {
	constructor (...surfaces) {
		options || ( options = {} );

		if ( options.conduit ) {
			this.set( options.conduit );
		}
	};

	setData (data) {

	}
};
