let Octane = require( '../../dist/js/octane.min' );
let assert = require( 'assert' );

describe( 'Data Provider Test', function() {

  describe( 'Static data test', function () {
    it( 'should output static data', function ( done ) {

        let prvdr = new Octane.DataProvider({
            name: 'Fred'
        });

        assert( prvdr.data().name === 'Fred', 'Data provider does not output correct data!' );
        done();

    });
  });

  describe( 'Dynamic data test', function () {
    it( 'should listen to data changes via set', function ( done ) {
        var listener = {
            onChange: function( data ){
                assert( data.name === 'Barney', 'Data provider does not notify of correct data!' );
                done();
            }
        };

        let prvdr = new DataProvider({
            name: 'Fred'
        });

        prvdr.bind( listener );

        prvdr.setData( 'name', 'Barney' );

    });
  });

});
