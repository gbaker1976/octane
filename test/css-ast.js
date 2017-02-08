import 'babel-polyfill';
let cssAst = require('../lib/css-ast');
let assert = require( 'assert' );

describe( 'CSS AST Parser', () => {
	describe( '#parser', () => {
      it( 'should parse simple css into AST', ( done ) => {
		let expected = {
			doc: [
				{
					selectors: [
						'#foo'
					],
					attributes: [
						{
							name: 'margin',
							value: '0 0 0 0'
						}
					]
				}
			]
		};
		let css = "#foo {margin: 0 0 0 0}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

  	});
});
