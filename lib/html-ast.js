/*
 * html-ast finite state machine
 * v1.0
 * author: Garrett Baker
 */
const CONTEXT_OPEN_TAG = 1;
const CONTEXT_CLOSE_TAG = 2;
const CONTEXT_OPEN_ELEMENT = 4;
const CONTEXT_CLOSE_ELEMENT = 8;
const CONTEXT_OPEN_COMMENT = 16;
const CONTEXT_CLOSE_COMMENT = 32;
const CONTEXT_OPEN_TEXT = 64;
const CONTEXT_CLOSE_TEXT = 128;
const CONTEXT_OPEN_PARAM_NAME = 256;
const CONTEXT_CLOSE_PARAM_NAME = 512;
const CONTEXT_PARAM_NAME_DELIMIT = 1024;
const CONTEXT_OPEN_PARAM_VALUE = 2048;
const CONTEXT_CLOSE_PARAM_VALUE = 4096;
const CONTEXT_OPEN_DECL = 8192;
const CONTEXT_CLOSE_DECL = 16384;
const CONTEXT_OPEN_DECL_NAME = 32768;
const CONTEXT_OPEN_TAG_NAME = 65536;
const CONTEXT_CLOSE_TAG_NAME = 131072;
const CONTEXT_CLOSE_OPEN_TAG = 262144;

const NODETYPE_ELEMENT = 1;
const NODETYPE_COMMENT = 2;
const NODETYPE_TEXT = 4;
const NODETYPE_PARAM = 8;
const NODETYPE_PARAM_VALUE = 16;
const NODETYPE_DECL = 32;

let createNodeOfType = (type) => {
	return {
		type: type || '',
		name: '',
		value: '',
		parameters: [],
		children: []
	};
};

let addChildNode = (ast, type) => {
	let len = 0;
	let arr;

	if ( ast.current === ast ) {
		arr = ast.current.doc;
	} else {
		if ( ast.current.type & ( NODETYPE_ELEMENT | NODETYPE_DECL ) &&
			 ast.parents.indexOf(ast.current) === -1 ) {

			ast.parents.push(ast.current);
		}

		arr = ast.parents[ast.parents.length-1].children;
	}

	len = arr.push(createNodeOfType( type || '' ));

	ast.current = arr[len-1];
};

let addParameter = (ast, name, value) => {
	let arr = ast.current.parameters;
	let i;
	let param;

	for ( i = 0; i < arr.length; i++ ) {
		if ( name === arr[i].name ) {
			param = arr[i];
			break;
		}
	}

	if ( !param ) {
		ast.current.parameters.push({
			name: name,
			value: value || ''
		});
	}
};

let unwireParent = (ast) => {
	ast.parents.pop();
	ast.current = ast.parents.length ? ast.parents[ast.parents.length-1] : ast;
};

let quoteDelimiter = (str, idx, ast, buf, context) => {
	if ( context & ( CONTEXT_OPEN_COMMENT | CONTEXT_OPEN_TEXT ) ) {
		buf.push(str[idx]);
	} else if ( context & ( CONTEXT_OPEN_TAG | CONTEXT_CLOSE_PARAM_NAME ) ) {
		return CONTEXT_OPEN_PARAM_VALUE;
	} else if ( context & CONTEXT_OPEN_PARAM_VALUE ) {
		ast.current.parameters[ast.current.parameters.length-1].value = buf.join('').replace(/\s+/, ' ');
		return CONTEXT_CLOSE_PARAM_VALUE;
	}

	return context;
};

let whitespaceDelimiter = (str, idx, ast, buf, context) => {
	let chr = str[idx];

	if ( context & ( CONTEXT_OPEN_COMMENT |
					 CONTEXT_OPEN_TEXT |
					 CONTEXT_OPEN_PARAM_VALUE ) ) {
		buf.push(chr);
	} else if ( context & ( CONTEXT_CLOSE_COMMENT |
							CONTEXT_OPEN_DECL_NAME |
							CONTEXT_OPEN_TAG_NAME ) ) {

		if ( context & CONTEXT_OPEN_DECL_NAME |
					   CONTEXT_OPEN_TAG_NAME ) {
			ast.current.name = buf.join('');
		}

		if ( context & CONTEXT_OPEN_TAG_NAME ) {
			return CONTEXT_OPEN_PARAM_NAME;
		}
		return CONTEXT_OPEN_DECL;
	} else if ( context & CONTEXT_CLOSE_PARAM_VALUE ) {
		return CONTEXT_OPEN_PARAM_NAME;
	}

	return context;
};

let tokens = {
	'<': (str, idx, ast, buf, context) => {
		let endTag = ( '/' === str[idx+1] );
		let openDecl = ( '!' === str[idx+1] );

		if ( null === context || (context & (CONTEXT_CLOSE_OPEN_TAG |
											 CONTEXT_CLOSE_DECL |
											 CONTEXT_CLOSE_ELEMENT |
											 CONTEXT_CLOSE_TEXT)) ) {
			if ( !endTag ) {
				addChildNode( ast, NODETYPE_ELEMENT );
			} else {
				return CONTEXT_OPEN_TAG;
			}
		} else if ( context & ( CONTEXT_OPEN_COMMENT |
								CONTEXT_OPEN_PARAM_VALUE ) ) {
			buf.push(str[idx]);
		} else if ( context & CONTEXT_OPEN_TEXT ) {
			if ( endTag ) {
				ast.current.value = buf.join('');
				return CONTEXT_OPEN_TAG;
			} else if ( openDecl ) {
				ast.current.value = buf.join('');
				addChildNode( ast, NODETYPE_DECL );
				return CONTEXT_OPEN_ELEMENT;
			} else {
				ast.current.value = buf.join('');
				addChildNode( ast, NODETYPE_ELEMENT );
				return CONTEXT_OPEN_ELEMENT;
			}

			return context;
		}

		return CONTEXT_OPEN_ELEMENT;
	},
	'>': (str, idx, ast, buf, context) => {
		if ( context & ( CONTEXT_OPEN_DECL |
						 CONTEXT_OPEN_DECL_NAME |
					  	 CONTEXT_OPEN_TAG_NAME ) ) {

			ast.current.name = buf.join('');

			if ( context & CONTEXT_OPEN_TAG_NAME ) {
				return CONTEXT_CLOSE_OPEN_TAG;
			}

			if ( context & ( CONTEXT_OPEN_DECL |
							 CONTEXT_OPEN_DECL_NAME ) ) {
				return CONTEXT_CLOSE_DECL;
			}
		} else if ( context & ( CONTEXT_OPEN_COMMENT |
								CONTEXT_OPEN_PARAM_VALUE |
								CONTEXT_CLOSE_TEXT ) ) {
			buf.push(str[idx]);
		} else if ( context & ( CONTEXT_OPEN_TAG |
								CONTEXT_CLOSE_TAG_NAME |
								CONTEXT_CLOSE_PARAM_VALUE |
								CONTEXT_CLOSE_PARAM_NAME ) ) {

			return CONTEXT_CLOSE_OPEN_TAG;
		} else if ( context & CONTEXT_CLOSE_TAG ) {
			return CONTEXT_CLOSE_ELEMENT;
		} else if ( context & CONTEXT_CLOSE_COMMENT ) {
			return CONTEXT_CLOSE_DECL;
		}

		return context;
	},
	'/': (str, idx, ast, buf, context) => {
		if ( context & ( CONTEXT_OPEN_COMMENT |
						 CONTEXT_OPEN_PARAM_VALUE |
						 CONTEXT_OPEN_TEXT ) ) {
			buf.push(str[idx]);
		} else if ( context & ( CONTEXT_OPEN_TAG_NAME |
								CONTEXT_CLOSE_TAG_NAME |
								CONTEXT_CLOSE_PARAM_VALUE |
								CONTEXT_CLOSE_PARAM_NAME ) ) {

			return CONTEXT_CLOSE_ELEMENT;
		} else if ( context & ( CONTEXT_OPEN_TAG ) ) {
			return CONTEXT_CLOSE_TAG;
		}

		return context;
	},
	'=': (str, idx, ast, buf, context) => {
		if ( context & CONTEXT_OPEN_PARAM_NAME ) {
			addParameter( ast, buf.join('') );
			return CONTEXT_CLOSE_PARAM_NAME;
		}

		if ( context & ( CONTEXT_OPEN_COMMENT |
						 CONTEXT_OPEN_PARAM_VALUE |
						 CONTEXT_OPEN_TEXT ) ) {
			buf.push(str[idx]);
		}

		return context;
	},
	"WS": whitespaceDelimiter,
	'"': quoteDelimiter,
	"'": quoteDelimiter,
	'!': (str, idx, ast, buf, context) => {
		if ( context & CONTEXT_OPEN_ELEMENT ) {
			ast.current.type = NODETYPE_DECL;
			return CONTEXT_OPEN_DECL;
		} else if ( context & ( CONTEXT_OPEN_COMMENT |
								CONTEXT_OPEN_PARAM_VALUE |
								CONTEXT_OPEN_TEXT ) ) {
			buf.push(str[idx]);
		}

		return context;
	},
	'-': (str, idx, ast, buf, context) => {
		if ( context & ( CONTEXT_OPEN_DECL | CONTEXT_CLOSE_COMMENT ) ) {
			if ( '-' == str[idx-1] ) {
				addChildNode( ast, NODETYPE_COMMENT );
				return CONTEXT_OPEN_COMMENT;
			}
		} else if ( context & CONTEXT_OPEN_COMMENT ) {
			if ( '-' == str[idx-1] ) {
				ast.current.value = buf.join('');
				return CONTEXT_CLOSE_COMMENT;
			} else if ( context & ( CONTEXT_OPEN_PARAM_NAME |
									CONTEXT_OPEN_PARAM_VALUE |
									CONTEXT_OPEN_TEXT |
								 	CONTEXT_OPEN_ELEMENT ) ) {
				buf.push(str[idx]);
				if ( context & CONTEXT_OPEN_ELEMENT ) {
					return CONTEXT_OPEN_PARAM_NAME;
				}
			}
		}

		return context;
	}
};
let parser = (str, idx, ast, buf, context) => {
	let chr;

	if ( !context && context !== 0 ) {
		context = null;
	}

	buf = buf || [];

	if ( !ast ) {
		ast = {
			current: null,
			parents: [],
			doc: []
		};
		ast.current = ast;
	}

	if ( !str || idx < 0 || str.length-1 < idx ) {
		delete ast.current;
		delete ast.parents;
		return ast;
	}

	chr = str[idx];

	if ( tokens[chr] || /\s/.test(chr) ) {
		if ( /\s/.test(chr) ) {
			chr = 'WS';
		}
		context = tokens[chr]( str, idx, ast, buf, context );

		if ( context & ( CONTEXT_CLOSE_COMMENT |
						 CONTEXT_CLOSE_DECL |
						 CONTEXT_CLOSE_TAG_NAME |
						 CONTEXT_CLOSE_TAG |
						 CONTEXT_OPEN_PARAM_NAME |
						 CONTEXT_CLOSE_PARAM_NAME |
						 CONTEXT_CLOSE_PARAM_VALUE |
						 CONTEXT_CLOSE_OPEN_TAG |
						 CONTEXT_CLOSE_ELEMENT |
						 CONTEXT_OPEN_ELEMENT |
						 CONTEXT_CLOSE_TEXT ) ) {
			buf = [];

			if ( context & ( CONTEXT_CLOSE_ELEMENT |
			 				 CONTEXT_CLOSE_TEXT |
					 		 CONTEXT_CLOSE_DECL ) ) {
				unwireParent( ast );
			}
		}
	} else {
		if ( context & ( CONTEXT_OPEN_TEXT |
						 CONTEXT_OPEN_COMMENT |
						 CONTEXT_OPEN_PARAM_VALUE |
						 CONTEXT_CLOSE_PARAM_VALUE |
						 CONTEXT_OPEN_PARAM_NAME |
						 CONTEXT_OPEN_DECL_NAME |
						 CONTEXT_OPEN_ELEMENT |
						 CONTEXT_OPEN_TAG_NAME ) ) {

			buf.push(chr);

			if ( context & CONTEXT_OPEN_ELEMENT ){
				context = CONTEXT_OPEN_TAG_NAME;
			}

		} else if ( context & ( CONTEXT_OPEN_DECL ) ) {
			if ( !ast.current.name ) {
				context = CONTEXT_OPEN_DECL_NAME;
				buf.push(chr);
			} else {
				ast.current.value += chr;
			}
		} else if ( context & CONTEXT_CLOSE_OPEN_TAG ) {
			context = CONTEXT_OPEN_TEXT;
			addChildNode( ast, NODETYPE_TEXT );
			buf.push(chr);
		}  else if ( context & CONTEXT_CLOSE_TAG ) {
			// context = CONTEXT_OPEN_TEXT;
			// addChildNode( ast, NODETYPE_TEXT );
			// buf.push(chr);
		}
	}

	return parser( str, ++idx, ast, buf, context );
};


module.exports = (html) => {
	return parser(html, 0);
};
