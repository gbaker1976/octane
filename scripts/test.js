require('child_process').exec(
	'./node_modules/.bin/mocha --compilers js:babel-register',
	function (error, stdout, stderr) {
	    console.log(stdout);
	    console.log(stderr);
	    if (error !== null) {
	      console.log(error);
	    }
	}
);
