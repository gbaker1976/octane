//import { BaseRenderer } from '../../src/js/ui/renderers/base';

export class DomRenderer {
	constructor( context ){
		super();
		this.context = context;
	};

	findDomNode( iomNode ) {
		return this.context.document.querySelectorAll( iomNode.id );
	};

	translateNode( iomNode ){
		var doc = this.context.document;
		var node;

		switch ( iomNode.type ) {
			case consts.NODETYPES.TEXT :
				node = doc.createTextNode( iomNode );
			case consts.NODETYPES.IOM :
				node = doc.createElement( iomNode.name );
				node = this.mapAttributes( iomNode, node );
				node = this.mapChildren( iomNode, node );
		}

		return node;
	};

	mapAttributes( iomNode, domNode ){

	};

	mapChildren( iomNode, domNode ){

	};
};
