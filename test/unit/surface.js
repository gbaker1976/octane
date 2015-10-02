import { Surface } from '../../src/js/ui/surface';
import { TextNode } from '../../src/js/ui/iom/textnode';
let assert = require( 'assert' );

describe( 'Surface Test', function() {

  describe( '#bind()', function () {
    it( 'should render a text node', function ( done ) {
        let repository = new Repository( { name: 'Fred' } );
        let sfc;
        let conduit;

        repository.defineSchema( 'test-schema', {
            map: [{
                lvalue: 'name',
                rvalue: 'firstName'
            }]
        });

        conduit = repository.getConduitBySchema( 'test-schema' );

        sfc = new Surface( 'testSurface', {
            conduit: conduit
        });

        sfc.listen( 'render', function( node ){
            assert( node === '', 'Surface does not render text node!' );
            done();
        });

        conduit.write( 'name', 'Bob' );
    });
  });

});
