var surface = require( '../../dist/octane.min' );

module.exports = {
  'Surface Test' : function (client, done) {
    client.assert.ok('TEST');

    setTimeout(function() {
      done();
    }, 500);
  }
};
