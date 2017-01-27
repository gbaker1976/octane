import { BaseRenderer } from 'base';

class DomRenderer extends BaseRenderer {
	constructor( context ){
		super();
		this.context = context;
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

export default DomRenderer;
