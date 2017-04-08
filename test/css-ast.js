import 'babel-polyfill';
let cssAst = require('../lib/css-ast');
let assert = require( 'assert' );

describe( 'CSS AST Parser', () => {
	describe( '#parser', () => {
      it( 'should parse simple css into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					selectors: [
						'#foo'
					],
					attributes: [
						{
							type: 4,
							name: 'margin',
							value: '0 0 0 0'
						}
					],
					value: ''
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
					type: 1,
					selectors: [
						'#foo',
						'#bar'
					],
					attributes: [
						{
							type: 4,
							name: 'margin',
							value: '0 0 0 0'
						}
					],
					value: ''
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
					type: 1,
					selectors: [
						'#foo > bar + [dog]',
						"fred[cat~='feline'] > :active"
					],
					attributes: [
						{
							type: 4,
							name: 'margin',
							value: '0 0 0 0'
						}
					],
					value: ''
				}
			]
		};
		let css = "#foo > bar + [dog], fred[cat~='feline'] > :active {margin: 0 0 0 0}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse multiple declaration with multiple complex selectors css into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					selectors: [
						'#foo > bar + [dog]',
						"fred[cat~='feline'] > :active"
					],
					attributes: [
						{
							type: 4,
							name: 'margin',
							value: '0 0 0 0'
						}
					],
					value: ''
				},
				{
					type: 1,
					selectors: [
						'body',
						"a > :hover"
					],
					attributes: [
						{
							type: 4,
							name: 'border',
							value: 'solid 1px #000'
						}
					],
					value: ''
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
					type: 1,
					selectors: [
						'#foo > bar + [dog]',
						"fred[cat~='feline'] > :active"
					],
					attributes: [
						{
							type: 4,
							name: 'margin',
							value: '0 0 0 0'
						},
						{
							type: 4,
							name: 'padding',
							value: '10px 100px 3em 4rem'
						}
					],
					value: ''
				},
				{
					type: 1,
					selectors: [
						'body',
						"a > :hover"
					],
					attributes: [
						{
							type: 4,
							name: 'border',
							value: 'solid 1px #000'
						}
					],
					value: ''
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
					type: 1,
					selectors: [
						'#foo'
					],
					attributes: [
						{
							type: 4,
							name: 'background',
							value: 'rgb(0, 0, 0, 0)'
						}
					],
					value: ''
				}
			]
		};
		let css = "#foo {background: rgb(0, 0, 0, 0)}";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse embedded comments into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 2,
					selectors: [],
					attributes: [],
					value: 'this is a comment'
				},
				{
					type: 1,
					selectors: [
						'#foo'
					],
					attributes: [
						{
							type: 4,
							name: 'background',
							value: 'rgb(0, 0, 0, 0)'
						}
					],
					value: ''
				}
			]
		};
		let css = "/* this is a comment */ #foo { background: rgb(0, 0, 0, 0) }";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse multiple embedded comments into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 2,
					selectors: [],
					attributes: [],
					value: 'this is a comment'
				},
				{
					type: 2,
					selectors: [],
					attributes: [],
					value: 'this is another comment'
				},
				{
					type: 1,
					selectors: [
						'#foo'
					],
					attributes: [
						{
							type: 4,
							name: 'background',
							value: 'rgb(0, 0, 0, 0)'
						}
					],
					value: ''
				}
			]
		};
		let css = "/* this is a comment *//* this is another comment */ #foo { background: rgb(0, 0, 0, 0) }";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should not parse embedded comments in declarations into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 2,
					selectors: [],
					attributes: [],
					value: 'this is a comment'
				},
				{
					type: 1,
					selectors: [
						'#foo'
					],
					attributes: [
						{
							type: 4,
							name: 'background',
							value: 'rgb(0, 0, 0, 0)'
						}
					],
					value: ''
				}
			]
		};
		let css = "/* this is a comment */ \n\n#foo { /* this is another comment */\nbackground: rgb(0, 0, 0, 0);/* this is another comment */ }";
		let actual = cssAst( css );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

  	});
});
