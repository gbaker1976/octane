import { Surface } from '../../src/js/ui/surface';
import { TextNode } from '../../src/js/ui/iom/textnode';
let assert = require( 'assert' );

describe( 'Surface Test', function() {

  describe( '#render()', function () {
    it( 'should render a text node', function ( done ) {
        let node = new TextNode( 'test' );
        let sfc = new Surface( 'surface' );
        sfc.children = [node];
        assert( node.render() === 'test', 'Surface does not render text node!' );
        done();
    });
  });

});
