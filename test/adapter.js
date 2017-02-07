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
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foobar',
							name: '',
							parameters: [],
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
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foobar',
							name: '',
							parameters: [],
							children: []
						}
					]
				},
				{
					type: 32,
					name: '',
					value: '',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'bazfred',
							name: '',
							parameters: [],
							children: []
						}
					]
				}
			]
		};
		let html = "<!--foobar--><!--bazfred-->";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse multiple child comments into AST', ( done ) => {
		let expected = {
			doc: [
				{
					name: 'div',
					type: 1,
					value: '',
					parameters: [],
					children: [
						{
							type: 32,
							name: '',
							value: '',
							parameters: [],
							children: [
								{
									type: 2, // comment
									value: 'foobar',
									name: '',
									parameters: [],
									children: []
								}
							]
						},
						{
							type: 32,
							name: '',
							value: '',
							parameters: [],
							children: [
								{
									type: 2, // comment
									value: 'bazfred',
									name: '',
									parameters: [],
									children: []
								}
							]
						}
					]
				}
			]
		};
		let html = "<div><!--foobar--><!--bazfred--></div>";
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
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foo',
							name: '',
							parameters: [],
							children: []
						},
						{
							type: 2, // comment
							value: '>bar',
							name: '',
							parameters: [],
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
					parameters: [],
					children: []
				},
				{
					type: 32,
					name: '',
					value: '',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foo',
							name: '',
							parameters: [],
							children: []
						},
						{
							type: 2, // comment
							value: '>bar',
							name: '',
							parameters: [],
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
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							parameters: [],
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

	  it( 'should parse tag parameter into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					parameters: [
						{
							name: 'class',
							value: 'test'
						}
					],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							parameters: [],
							value: 'foobar'
						}
					]
				}
			]
		};
		let html = "<h1 class='test'>foobar</h1>";
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
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							parameters: [],
							value: 'foobar'
						}
					]
				},
				{
					type: 32,
					name: '',
					value: '',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'baz',
							name: '',
							parameters: [],
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
					parameters: [],
					children: [
						{
							type: 1,
							name: 'span',
							value: '',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									parameters: [],
									value: 'foobar'
								}
							]
						}
					]
				}
			]
		};

		let html = "<h1><span>foobar</span></h1>";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse sigbling tags into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							parameters: [],
							value: 'foobar'
						}
					]
				},
				{
					type: 1,
					name: 'h1',
					value: '',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							parameters: [],
							value: 'bazfred'
						}
					]
				}
			]
		};
		let html = "<h1>foobar</h1><h1>bazfred</h1>";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse heirarchical sigbling tags into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'div',
					value: '',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									parameters: [],
									value: 'foobar'
								}
							]
						},
						{
							type: 1,
							name: 'h1',
							value: '',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									parameters: [],
									value: 'bazfred'
								}
							]
						}
					]
				}
			]
		};
		let html = "<div><h1>foobar</h1><h1>bazfred</h1></div>";
		let actual = htmlAst( html );
		//console.log(JSON.stringify(actual));
		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse mixed sigblings into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'div',
					value: '',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									parameters: [],
									value: 'foobar'
								},
								{
									type: 1,
									name: 'span',
									parameters: [],
									children: [
										{
											type: 4,
											name: '',
											children: [],
											parameters: [],
											value: 'the baz'
										}
									],
									value: ''
								}
							]
						},
						{
							type: 1,
							name: 'h1',
							value: '',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									parameters: [],
									value: 'bazfred'
								}
							]
						}
					]
				}
			]
		};
		let html = "<div><h1>foobar<span>the baz</span></h1><h1>bazfred</h1></div>";
		let actual = htmlAst( html );
		//console.log(JSON.stringify(actual));
		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse heirarchical sigbling tags and multiple sibling comments into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'div',
					value: '',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									parameters: [],
									value: 'foobar'
								},
								{
									type: 32,
									name: '',
									value: '',
									parameters: [],
									children: [
										{
											type: 2,
											name: '',
											children: [],
											parameters: [],
											value: 'hello there'
										}
									]
								},
								{
									type: 32,
									name: '',
									value: '',
									parameters: [],
									children: [
										{
											type: 2,
											name: '',
											children: [],
											parameters: [],
											value: 'another comment'
										}
									]
								}
							]
						},
						{
							type: 1,
							name: 'h1',
							value: '',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									parameters: [],
									value: 'bazfred'
								}
							]
						}
					]
				}
			]
		};
		let html = "<div><h1>foobar<!--hello there--><!--another comment--></h1><h1>bazfred</h1></div>";
		let actual = htmlAst( html );
		//console.log(JSON.stringify(actual));
		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	//   it( 'should parse heirarchical sigbling tags and sibling comments into AST', ( done ) => {
	// 	let expected = {
	// 		doc: [
	// 			{
	// 				type: 1,
	// 				name: 'div',
	// 				value: '',
	// 				children: [
	// 					{
	// 						type: 1,
	// 						name: 'h1',
	// 						value: '',
	// 						children: [
	// 							{
	// 								type: 4,
	// 								name: '',
	// 								children: [],
	// 								value: 'foobar'
	// 							},
	// 							{
	// 								type: 32,
	// 								name: '',
	// 								value: '',
	// 								children: [
	// 									{
	// 										type: 2,
	// 										name: '',
	// 										children: [],
	// 										value: 'hello there'
	// 									}
	// 								]
	// 							},
	// 							{
	// 								type: 1,
	// 								name: 'span',
	// 								value: '',
	// 								children: [
	// 									{
	// 										type: 4,
	// 										name: '',
	// 										children: [],
	// 										value: 'dog'
	// 									}
	// 								]
	// 							}
	// 						]
	// 					},
	// 					{
	// 						type: 1,
	// 						name: 'h1',
	// 						value: '',
	// 						children: [
	// 							{
	// 								type: 4,
	// 								name: '',
	// 								children: [],
	// 								value: 'bazfred'
	// 							}
	// 						]
	// 					}
	// 				]
	// 			}
	// 		]
	// 	};
	// 	let html = "<div><h1>foobar<!--hello there--><span>dog</span></h1><h1>bazfred</h1></div>";
	// 	let actual = htmlAst( html );
	// 	//console.log(JSON.stringify(actual));
	// 	assert.deepEqual( actual, expected, 'Result of parse does not match!' );
	// 	done();
    //   });
	  //
	//   it( 'should parse heirarchical sigbling tags into AST', ( done ) => {
	// 	let expected = {
	// 		doc: [
	// 			{
	// 				type: 1,
	// 				name: 'div',
	// 				value: '',
	// 				children: [
	// 					{
	// 						type: 1,
	// 						name: 'h1',
	// 						value: '',
	// 						children: [
	// 							{
	// 								type: 4,
	// 								name: '',
	// 								children: [],
	// 								value: 'foobar'
	// 							},
	// 							{
	// 								type: 1,
	// 								name: 'i',
	// 								value: '',
	// 								children: [
	// 									{
	// 										type: 4,
	// 										name: '',
	// 										children: [],
	// 										value: 'a'
	// 									}
	// 								]
	// 							},
	// 							{
	// 								type: 1,
	// 								name: 'span',
	// 								value: '',
	// 								children: [
	// 									{
	// 										type: 4,
	// 										name: '',
	// 										children: [],
	// 										value: 'dog'
	// 									}
	// 								]
	// 							}
	// 						]
	// 					},
	// 					{
	// 						type: 1,
	// 						name: 'h1',
	// 						value: '',
	// 						children: [
	// 							{
	// 								type: 4,
	// 								name: '',
	// 								children: [],
	// 								value: 'bazfred'
	// 							}
	// 						]
	// 					}
	// 				]
	// 			}
	// 		]
	// 	};
	// 	let html = "<div><h1>foobar<i>a</i><span>dog</span></h1><h1>bazfred</h1></div>";
	// 	let actual = htmlAst( html );
	// 	assert.deepEqual( actual, expected, 'Result of parse does not match!' );
	// 	done();
    //   });

  	});
});
