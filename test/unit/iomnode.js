import { IomNode } from '../../src/js/ui/iom/iomnode';
import { TextNode } from '../../src/js/ui/iom/textnode';
import { consts } from '../../src/js/ui/iom/consts';

let assert = require( 'assert' );

describe( 'IomNode Test', function() {

  describe( '#render()', function () {
    it( 'should render node tree', function ( done ) {
        let node1 = new IomNode( 'div' );
        let node2 = new IomNode( 'div' );
        let textNode = new TextNode( 'foo' );

        node2.children = [textNode];
        node1.children = [node2];

        assert( node1.render() === '<div><div>foo</div></div>', 'IomNode does not render node tree!' );
        done();
    });

    it( 'should deep render node tree', function ( done ) {
        let node1 = new IomNode( 'div' );
        let node2 = new IomNode( 'div' );
        let textNode = new TextNode( 'foo' );

        node2.children = [textNode];
        node1.children = [node2];

        assert( node1._deepRender( node1 ) === '<div><div>foo</div></div>', 'IomNode does not deep render node tree!' );
        done();
    });
  });

  describe( '#properties', function () {
    it( 'should assign children', function ( done ) {
        let node1 = new IomNode( 'div' );
        let textNode = new TextNode( 'foo' );

        node1.children = [textNode];

        assert( node1.children[0] === textNode, 'Children do not match!' );
        done();
    });

    it( 'should assign name', function ( done ) {
        let node1 = new IomNode( 'div' );

        assert( node1.name === 'div', 'Name does not match!' );
        done();
    });

    it( 'should assign IOM node type', function ( done ) {
        let node1 = new IomNode( 'div' );

        assert( node1.type === consts.NODETYPES.IOM, 'Type does not match!' );
        done();
    });
  });

});
