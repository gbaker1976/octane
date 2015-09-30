import { IomNode } from '../../src/js/ui/iom/iomnode';
import { TextNode } from '../../src/js/ui/iom/textnode';
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
  });

});
