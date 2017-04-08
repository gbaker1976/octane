import 'babel-polyfill';
let htmlAst = require('../lib/html-ast/html-ast');
let assert = require( 'assert' );

describe( 'HTML AST Parser', () => {
	describe( '#parser', () => {
      it( 'should parse simple comment into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 32,
					name: '',
					value: '',
					context: '*',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foobar',
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foobar',
							name: '',
							context: '*',
							parameters: [],
							children: []
						}
					]
				},
				{
					type: 32,
					name: '',
					value: '',
					context: '*',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'bazfred',
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 32,
							name: '',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 2, // comment
									value: 'foobar',
									name: '',
									context: '*',
									parameters: [],
									children: []
								}
							]
						},
						{
							type: 32,
							name: '',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 2, // comment
									value: 'bazfred',
									name: '',
									context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foo',
							name: '',
							context: '*',
							parameters: [],
							children: []
						},
						{
							type: 2, // comment
							value: '>bar',
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: []
				},
				{
					type: 32,
					name: '',
					value: '',
					context: '*',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'foo',
							name: '',
							context: '*',
							parameters: [],
							children: []
						},
						{
							type: 2, // comment
							value: '>bar',
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							context: '*',
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

	  it( 'should parse mixed children into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					context: '*',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							context: '*',
							children: [],
							parameters: [],
							value: 'foobar'
						},
						{
							type: 1,
							name: 'span',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									context: '*',
									value: 'dino',
									parameters: [],
									children: []
								}
							]
						},
						{
							type: 4,
							name: '',
							children: [],
							context: '*',
							parameters: [],
							value: 'bazfred'
						}
					]
				}
			]
		};
		let html = "<h1>foobar<span>dino</span>bazfred</h1>";
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
					context: '*',
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
							context: '*',
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

	  it( 'should parse multiple tag parameter into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					context: '*',
					parameters: [
						{
							name: 'class',
							value: 'test'
						},
						{
							name: 'id',
							value: 'test2'
						}
					],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							context: '*',
							parameters: [],
							value: 'foobar'
						}
					]
				}
			]
		};
		let html = "<h1 class='test' id='test2'>foobar</h1>";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse duplicate parameters to overwrite previous into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					context: '*',
					parameters: [
						{
							name: 'class',
							value: 'test2'
						}
					],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							context: '*',
							parameters: [],
							value: 'foobar'
						}
					]
				}
			]
		};
		let html = "<h1 class='test' class='test2'>foobar</h1>";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse whitespace into text node into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					context: '*',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							children: [],
							context: '*',
							parameters: [],
							value: "foobar\nbaz\t\t\tfred"
						}
					]
				}
			]
		};
		let html = "<h1>foobar\nbaz\t\t\tfred</h1>";
		let actual = htmlAst( html );

		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

	  it( 'should parse collapse whitespace into spaces into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'h1',
					value: '',
					context: '*',
					parameters: [
						{
							name: "class",
							value: "one two"
						},
						{
							name: "id",
							value: " test"
						}
					],
					children: [
						{
							type: 4,
							name: '',
							context: '*',
							children: [],
							parameters: [],
							value: "foobar"
						}
					]
				}
			]
		};
		let html = "<h1\n\nclass='one two'\rid='\n\ttest'>foobar</h1>";
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 2, // comment
							value: 'baz',
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'span',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 4,
							name: '',
							context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									context: '*',
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
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									context: '*',
									parameters: [],
									value: 'foobar'
								},
								{
									type: 1,
									name: 'span',
									context: '*',
									parameters: [],
									children: [
										{
											type: 4,
											name: '',
											children: [],
											context: '*',
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
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									context: '*',
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									context: '*',
									parameters: [],
									value: 'foobar'
								},
								{
									type: 32,
									name: '',
									value: '',
									context: '*',
									parameters: [],
									children: [
										{
											type: 2,
											name: '',
											children: [],
											context: '*',
											parameters: [],
											value: 'hello there'
										}
									]
								},
								{
									type: 32,
									name: '',
									value: '',
									context: '*',
									parameters: [],
									children: [
										{
											type: 2,
											name: '',
											children: [],
											context: '*',
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
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									context: '*',
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

	  it( 'should parse heirarchical sigbling tags and sibling comments into AST', ( done ) => {
		let expected = {
			doc: [
				{
					type: 1,
					name: 'div',
					value: '',
					context: '*',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									context: '*',
									parameters: [],
									value: 'foobar'
								},
								{
									type: 32,
									name: '',
									context: '*',
									value: '',
									parameters: [],
									children: [
										{
											type: 2,
											name: '',
											context: '*',
											children: [],
											parameters: [],
											value: 'hello there'
										}
									]
								},
								{
									type: 1,
									name: 'span',
									context: '*',
									value: '',
									parameters: [],
									children: [
										{
											type: 4,
											name: '',
											context: '*',
											children: [],
											parameters: [],
											value: 'dog'
										}
									]
								}
							]
						},
						{
							type: 1,
							name: 'h1',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									context: '*',
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
		let html = "<div><h1>foobar<!--hello there--><span>dog</span></h1><h1>bazfred</h1></div>";
		let actual = htmlAst( html );
		//console.log(JSON.stringify(actual));
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
					context: '*',
					parameters: [],
					children: [
						{
							type: 1,
							name: 'h1',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									context: '*',
									children: [],
									parameters: [],
									value: 'foobar'
								},
								{
									type: 1,
									name: 'i',
									value: '',
									context: '*',
									parameters: [],
									children: [
										{
											type: 4,
											name: '',
											context: '*',
											children: [],
											parameters: [],
											value: 'a'
										}
									]
								},
								{
									type: 1,
									name: 'span',
									value: '',
									context: '*',
									parameters: [],
									children: [
										{
											type: 4,
											name: '',
											context: '*',
											children: [],
											parameters: [],
											value: 'dog'
										}
									]
								}
							]
						},
						{
							type: 1,
							name: 'h1',
							value: '',
							context: '*',
							parameters: [],
							children: [
								{
									type: 4,
									name: '',
									children: [],
									context: '*',
									parameters: [],
									value: 'bazfred'
								}
							]
						}
					]
				}
			]
		};
		let html = "<div><h1>foobar<i>a</i><span>dog</span></h1><h1>bazfred</h1></div>";
		let actual = htmlAst( html );
		assert.deepEqual( actual, expected, 'Result of parse does not match!' );
		done();
      });

  	});
});
