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

	  it( 'should parse multiple selector css into AST', ( done ) => {
		let expected = {
			doc: [
				{
					selectors: [
						'#foo',
						'#bar'
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
		let css = "#foo, #bar {margin: 0 0 0 0}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse multiple complex selectors css into AST', ( done ) => {
		let expected = {
			doc: [
				{
					selectors: [
						'#foo > bar + [dog]',
						"fred[cat~='feline'] > :active"
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
		let css = "#foo > bar + [dog], fred[cat~='feline'] > :active {margin: 0 0 0 0}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse multiple complex selectors css into AST', ( done ) => {
		let expected = {
			doc: [
				{
					selectors: [
						'#foo > bar + [dog]',
						"fred[cat~='feline'] > :active"
					],
					attributes: [
						{
							name: 'margin',
							value: '0 0 0 0'
						}
					]
				},
				{
					selectors: [
						'body',
						"a > :hover"
					],
					attributes: [
						{
							name: 'border',
							value: 'solid 1px #000'
						}
					]
				}
			]
		};
		let css = "#foo > bar + [dog], fred[cat~='feline'] > :active {margin: 0 0 0 0}\n\n \tbody, a > :hover {border: solid 1px #000}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse multiple complex selectors and multiple attributes into AST', ( done ) => {
		let expected = {
			doc: [
				{
					selectors: [
						'#foo > bar + [dog]',
						"fred[cat~='feline'] > :active"
					],
					attributes: [
						{
							name: 'margin',
							value: '0 0 0 0'
						},
						{
							name: 'padding',
							value: '10px 100px 3em 4rem'
						}
					]
				},
				{
					selectors: [
						'body',
						"a > :hover"
					],
					attributes: [
						{
							name: 'border',
							value: 'solid 1px #000'
						}
					]
				}
			]
		};
		let css = "#foo > bar + [dog], fred[cat~='feline'] > :active {margin: 0 0 0 0;\npadding: 10px 100px 3em 4rem;}\n\n \tbody, a > :hover {border: solid 1px #000}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse embedded commas in attribute value into AST', ( done ) => {
		let expected = {
			doc: [
				{
					selectors: [
						'#foo'
					],
					attributes: [
						{
							name: 'background',
							value: 'rgb(0, 0, 0, 0)'
						}
					]
				}
			]
		};
		let css = "#foo {background: rgb(0, 0, 0, 0)}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

  	});
});
