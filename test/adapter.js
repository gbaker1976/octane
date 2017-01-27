import 'babel-polyfill';
let adapter = require('../lib/adapter');

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
