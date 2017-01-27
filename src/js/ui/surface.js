import { IomNode } from 'iom/iomnode';

export class Surface extends IomNode {
	constructor (...surfaces) {
		options || ( options = {} );

		super();

		if ( options.conduit ) {
			this.set( options.conduit );
		}
	};

	setData (data) {

	}
};
