import 'babel-polyfill';
import { IomNode } from '../src/js/ui/iom/iomnode';
import { TextNode } from '../src/js/ui/iom/textnode';
import { consts } from '../src/js/ui/iom/consts';

let assert = require( 'assert' );

describe( 'IomNode Test', () => {

  describe( '#properties', () => {
    it( 'should assign children', ( done ) => {
        let node1 = new IomNode({
			name: 'div'
		});
        let textNode = new TextNode( 'foo' );

        node1.children = [textNode];

        assert( node1.children[0] === textNode, 'Children do not match!' );
        done();
    });

    it( 'should assign name', ( done ) => {
        let node1 = new IomNode({
			name: 'div'
		});

        assert( node1.name === 'div', 'Name does not match!' );
        done();
    });

    it( 'should assign IOM node type', ( done ) => {
        let node1 = new IomNode({
			name: 'div'
		});

        assert( node1.type === consts.NODETYPES.IOM, 'Type does not match!' );
        done();
    });
  });

});
