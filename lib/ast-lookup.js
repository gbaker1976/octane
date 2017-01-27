let fs = require('fs');

module.exports = {
	get: ( id, cb ) => {
		fs.readFile( 'data/' + id + '.json', cb );
	}
};
