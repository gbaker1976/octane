//import { EmptyNode } from '../iom/emptynode';
import { IomNode } from '../ui/iom/iomnode';

/*
	new Surface({
		conduit: Conduit.share(new Query( 'name=*' ));
	});
*/

export class Surface extends IomNode {
	constructor( options ){
		options || ( options = {} );

		if ( options.conduit ) {
			this.set( options.conduit );
		}
	};

    set( conduit ){
		conduit.on( 'update', this.handleUpdate.bind(this) );
	};
};
