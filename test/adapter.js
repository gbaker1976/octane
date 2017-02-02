import 'babel-polyfill';
let adapter = require('../lib/adapter');
let htmlAst = require('../lib/html-ast');

let assert = require( 'assert' );

describe( 'Adapter Test', () => {

  describe( '#arrayWalker', () => {
    it( 'should walk array', ( done ) => {
		let arr = ['a', 'b', 'c'];
		let f = function( c, n ){
			return n;
		};

        assert( adapter.arrayWalker( '', arr, 0, f, '' ) === 'abc', 'Result of array walk does not match!' );
        done();
    });
  });

  describe( '#el', () => {
    it( 'should render single element dom with text child', ( done ) => {
		let dom = {
			"name": "abc",
			"type": "element",
			"context": "*",
			"children": [
				{
					"type": "text",
					"value": "123"
				}
			]
		};

        assert( adapter.el( '*', dom ) === '<abc>123</abc>', 'Result of render does not match!' );
        done();
    });

	it( 'should render single desktop element dom with text child', ( done ) => {
		let dom = {
			"name": "abc",
			"type": "element",
			"context": "desktop",
			"children": [
				{
					"type": "text",
					"value": "123"
				}
			]
		};

        assert( adapter.el( 'desktop', dom ) === '<abc>123</abc>', 'Result of render does not match!' );
        done();
    });

	it( 'should render single element dom with many children', ( done ) => {
		let dom = {
			"name": "abc",
			"type": "element",
			"context": "*",
			"children": [
				{
					"name": "a",
					"type": "element",
					"context": "*",
					"children": [
						{
							"type": "text",
							"value": "a"
						}
					]
				},
				{
					"name": "b",
					"type": "element",
					"context": "*",
					"children": [
						{
							"type": "text",
							"value": "b"
						}
					]
				},
				{
					"name": "c",
					"type": "element",
					"context": "*",
					"children": [
						{
							"type": "text",
							"value": "c"
						}
					]
				}
			]
		};

        assert( adapter.el( '*', dom ) === '<abc><a>a</a><b>b</b><c>c</c></abc>', 'Result of render does not match!' );
        done();
    });

	it( 'should render single element dom with many children with children', ( done ) => {
		let dom = {
			"name": "abc",
			"type": "element",
			"context": "*",
			"children": [
				{
					"name": "a",
					"type": "element",
					"context": "*",
					"children": [
						{
							"type": "text",
							"value": "a2text"
						},
						{
							"name": "a2",
							"type": "element",
							"context": "*",
							"children": [
								{
									"type": "text",
									"value": "a2"
								}
							]
						}
					]
				},
				{
					"name": "b",
					"type": "element",
					"context": "*",
					"children": [
						{
							"type": "text",
							"value": "b"
						}
					]
				},
				{
					"name": "c",
					"type": "element",
					"context": "*",
					"children": [
						{
							"type": "text",
							"value": "c"
						}
					]
				}
			]
		};

        assert( adapter.el( '*', dom ) === '<abc><a>a2text<a2>a2</a2></a><b>b</b><c>c</c></abc>', 'Result of render does not match!' );
        done();
    });

	it( 'should render only desktop elements', ( done ) => {
		let dom = {
			"name": "abc",
			"type": "element",
			"context": "desktop",
			"children": [
				{
					"name": "a",
					"type": "element",
					"context": "mobile",
					"children": [
						{
							"type": "text",
							"value": "a2text"
						},
						{
							"name": "a2",
							"type": "element",
							"context": "*",
							"children": [
								{
									"type": "text",
									"value": "a2"
								}
							]
						}
					]
				},
				{
					"name": "b",
					"type": "element",
					"context": "desktop",
					"children": [
						{
							"type": "text",
							"value": "b"
						}
					]
				},
				{
					"name": "c",
					"type": "element",
					"context": "mobile",
					"children": [
						{
							"type": "text",
							"value": "c"
						}
					]
				}
			]
		};

        assert( adapter.el( 'desktop', dom ) === '<abc><b>b</b></abc>', 'Result of render does not match!' );
        done();
    });

	it( 'should render single element dom with all children, regardless of context', ( done ) => {
		let dom = {
			"name": "abc",
			"type": "element",
			"context": "desktop",
			"children": [
				{
					"name": "a",
					"type": "element",
					"context": "*",
					"children": [
						{
							"type": "text",
							"value": "a"
						}
					]
				},
				{
					"name": "b",
					"type": "element",
					"context": "mobile",
					"children": [
						{
							"type": "text",
							"value": "b"
						}
					]
				},
				{
					"name": "c",
					"type": "element",
					"context": "desktop",
					"children": [
						{
							"type": "text",
							"value": "c"
						}
					]
				}
			]
		};

        assert( adapter.el( '*', dom ) === '<abc><a>a</a><b>b</b><c>c</c></abc>', 'Result of render does not match!' );
        done();
    });

  });

});

describe( 'HTML AST Parser', () => {
	describe( '#parser', () => {
      it( 'should parse simple comment into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 32,
					name: '',
					value: '',
					children: [
						{
							type: 2, // comment
							value: 'foobar',
							name: '',
							children: []
						}
					]
				}
			]
		};
		let html = "<!--foobar-->";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse multiple comments into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 32,
					name: '',
					value: '',
					children: [
						{
							type: 2, // comment
							value: 'foo',
							name: '',
							children: []
						},
						{
							type: 2, // comment
							value: '>bar',
							name: '',
							children: []
						}
					]
				}
			]
		};
		let html = "<!--foo-- -->bar-->";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse DOCTYPE into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 32,
					name: 'doctype',
					value: 'html',
					children: []
				},
				{
					type: 32,
					name: '',
					value: '',
					children: [
						{
							type: 2, // comment
							value: 'foo',
							name: '',
							children: []
						},
						{
							type: 2, // comment
							value: '>bar',
							name: '',
							children: []
						}
					]
				}
			]
		};
		let html = "<!doctype html><!--foo-- -->bar-->";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse tag into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					children: [
						{
							type: 4,
							name: '',
							children: [],
							value: 'foobar'
						}
					]
				}
			]
		};
		let html = "<h1>foobar</h1>";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse tags into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					children: [
						{
							type: 4,
							name: '',
							children: [],
							value: 'foobar'
						}
					]
				},
				{
					type: 32,
					name: '',
					value: '',
					children: [
						{
							type: 2, // comment
							value: 'baz',
							name: '',
							children: []
						}
					]
				}
			]
		};
		let html = "<h1>foobar</h1><!--baz-->";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse heirarchical tags into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					children: [
						{
							type: 1,
							name: 'span',
							value: '',
							children: [
								{
									type: 4,
									name: '',
									children: [],
									value: 'foobar'
								}
							]
						}
					]
				}
			]
		};
		/*
		The error here is that when encountering the closing tag of a
		non-heirachical tree, the closing tag is actually never accounted for.
		The context remains CONTEXT_CLOSE_TEXT until the end of markup.

		The logic accounts for closing tags must be reworked to account for the
		closing tags. This helps in many ways since the parser will need to track
		that closing tags match their opening tags.
		*/
		let html = "<h1><span>foobar</span></h1>";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });
  	});
});
