import { Repository } from '../../src/js/ui/repository';
let assert = require( 'assert' );

describe( 'Repository Test', function() {

  describe( 'Static data', function () {
    it( 'should read name', function ( done ) {
        let repository = new Repository( { name: 'Fred' } );

        assert( repository.read( 'name' ).name === 'Fred', 'Name does not match!' );
        done();
    });

    it( 'should read first name and last name', function ( done ) {
        let repository = new Repository( { firstname: 'Fred', lastname: 'Flintstone' } );
        let data = repository.read( [ 'firstname', 'lastname' ] );

        assert( data.firstname === 'Fred' && data.lastname === 'Flintstone', 'First name and last name do not match!' );
        done();
    });
  });

  describe( 'Generic conduit', function () {
      if( 'should bind to conduit', function( done ){
          let repository = new Repository( { name: 'Fred' } );
          let conduit = repository.getConduit();

          conduit.bind( function( data ){
              assert( data.name === 'Bob', 'Name does not match!' );
              done();
          });

          repository.set( 'name', 'Bob' );
      });
  });

});
