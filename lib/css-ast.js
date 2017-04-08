/*
 * css-ast finite state machine
 * v1.0
 * author: Garrett Baker
 */
import * as constants from './css-consts';

let addDeclaration = (ast, decl) => {
	let len = ast.doc.push(decl);
	ast.current = ast.doc[len-1];
};

let createDeclaration = (ast, type, selectors, attributes, children, value) => {
	return {
		type: type || constants.NODETYPE_DECL,
		selectors: selectors || [],
		attributes: attributes || [],
		value: value || ''
	};
};

let addAttribute = (ast, name, value, type) => {
	let len = ast.current.attributes.push({
		type: type || constants.NODETYPE_ATTRIBUTE,
		name: name || '',
		value: value || ''
	});
};

let addSelector = (ast, selector) => {
	if (selector) {
		ast.current.selectors.push(selector);
	}
};

let assignAttributeValue = ( ast, buf ) => {
	if ( buf.length ) {
		ast.current.attributes[ast.current.attributes.length-1].value = buf.join('').trim();
	}
};

let tokens = {
	'{': (str, idx, ast, buf, context) => {
		if ( context & constants.CONTEXT_OPEN_SELECTOR ) {
			return constants.CONTEXT_OPEN_DECLARATION_BODY;
		}
	},
	'}': (str, idx, ast, buf, context) => {
		if ( context & ( constants.CONTEXT_OPEN_DECLARATION_BODY |
						 constants.CONTEXT_OPEN_ATTRIBUTE_VALUE |
					 	 constants.CONTEXT_CLOSE_ATTRIBUTE_VALUE ) ) {
			return constants.CONTEXT_CLOSE_DECLARATION_BODY;
		}
	},
	':': (str, idx, ast, buf, context) => {
		if ( context & ( constants.CONTEXT_OPEN_ATTRIBUTE_NAME ) ) {
			return constants.CONTEXT_CLOSE_ATTRIBUTE_NAME;
		}

		if ( context & constants.CONTEXT_OPEN_SELECTOR ) {
			buf.push(str[idx]);
			return context;
		}
	},
	';': (str, idx, ast, buf, context) => {
		if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_VALUE ) {
			return constants.CONTEXT_CLOSE_ATTRIBUTE_VALUE;
		}
	},
	',': (str, idx, ast, buf, context) => {
		if ( context & ( constants.CONTEXT_OPEN_SELECTOR ) ) {
			return constants.CONTEXT_CLOSE_SELECTOR;
		}

		if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_VALUE ) {
			buf.push(str[idx]);
			return context;
		}
	},
	'/': (str, idx, ast, buf, context) => {
		if ( '*' === str[idx+1] ) {
			if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_VALUE ) {
				throw new Error('Validation Error: comments are not valid within attribute values');
			}

			if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_NAME ) {
				throw new Error('Validation Error: comments are not valid within attribute names');
			}

			if ( context & constants.CONTEXT_OPEN_SELECTOR ) {
				throw new Error('Validation Error: comments are not valid within selectors');
			}

			return context | constants.CONTEXT_OPEN_COMMENT;
		} else if ( (context & constants.CONTEXT_OPEN_COMMENT) && '*' === str[idx-1] ) {
			return (context | constants.CONTEXT_CLOSE_COMMENT) ^ constants.CONTEXT_OPEN_COMMENT;
		} else if ( context & constants.CONTEXT_CLOSE_COMMENT ) {
			return context ^ constants.CONTEXT_CLOSE_COMMENT;
		}

		return context;
	},
	'*': (str, idx, ast, buf, context) => {
		if ( context & constants.CONTEXT_OPEN_COMMENT ) {
			return (context | constants.CONTEXT_OPEN_COMMENT_CONTENT) ^ constants.CONTEXT_OPEN_COMMENT;
		} else if ( context & constants.CONTEXT_OPEN_COMMENT_CONTENT ) {
			if ( '/' === str[idx+1] ) {
				context = context ^ constants.CONTEXT_OPEN_COMMENT_CONTENT;
				return context | constants.CONTEXT_CLOSE_COMMENT;
			}

			buf.push(str[idx]);
			return context;
		}

		buf.push(str[idx]);
	},
};
let parser = (str, idx, ast, buf, context) => {
	let chr;
	let isWhitespace;

	if ( !context && context !== 0 ) {
		context = null;
	}

	buf = buf || [];

	if ( !ast ) {
		ast = {
			current: null,
			doc: []
		};
		ast.current = ast;
	}

	if ( !str || idx < 0 || str.length-1 < idx ) {
		delete ast.current;
		return ast;
	}

	chr = str[idx];

	if ( tokens[chr] ) {
		context = tokens[chr]( str, idx, ast, buf, context );

		if ( context & constants.CONTEXT_OPEN_COMMENT ) {
			// guard against comments in selectors or attribute names/values
			if ( constants.CONTEXT_OPEN_COMMENT === context || context & constants.CONTEXT_CLOSE_DECLARATION_BODY ) {
				addDeclaration( ast, createDeclaration( ast, constants.NODETYPE_COMMENT ) );

			// this is the same as the close attribute value check below...
			} else if ( context & (constants.CONTEXT_CLOSE_ATTRIBUTE_VALUE |
								   constants.CONTEXT_CLOSE_DECLARATION_BODY) ) {
				assignAttributeValue( ast, buf );
				buf = [];
			}
		} else if ( context & constants.CONTEXT_CLOSE_COMMENT ) {
			// guard against comments in selectors or attribute names/values
			if ( constants.CONTEXT_CLOSE_COMMENT === context || context & constants.CONTEXT_CLOSE_DECLARATION_BODY ) {
				ast.current.value = buf.join('').trim();
			}

			buf = [];
		} else if ( context & ( constants.CONTEXT_CLOSE_SELECTOR |
						 		constants.CONTEXT_OPEN_DECLARATION_BODY ) ) {
			addSelector( ast, buf.join('').trim() );
			buf = [];
		} else if ( context & constants.CONTEXT_CLOSE_ATTRIBUTE_NAME ) {
			if ( buf.length ) {
				ast.current.attributes[ast.current.attributes.length-1].name = buf.join('').trim();
				buf = [];
			}
		} else if ( context & ( constants.CONTEXT_CLOSE_ATTRIBUTE_VALUE |
							    constants.CONTEXT_CLOSE_DECLARATION_BODY ) ) {
			assignAttributeValue( ast, buf );
			buf = [];
		}

	} else {
		isWhitespace = /\s/.test(chr);

		if ( context & constants.CONTEXT_OPEN_COMMENT_CONTENT ) {
			buf.push(chr);
		} else if ( isWhitespace && (context & ( constants.CONTEXT_OPEN_ATTRIBUTE_VALUE |
										  constants.CONTEXT_OPEN_SELECTOR ))) {
			buf.push(chr);
		} else {
			if ( null === context || 0 === context || context & constants.CONTEXT_CLOSE_DECLARATION_BODY ) {
				if ( !isWhitespace ) {
					addDeclaration( ast, createDeclaration( ast ) );
					context = constants.CONTEXT_OPEN_SELECTOR;
				}
			}

			if ( isWhitespace && (context & constants.CONTEXT_CLOSE_SELECTOR) ) {
				context = constants.CONTEXT_OPEN_SELECTOR;
			} else if ( context & constants.CONTEXT_OPEN_SELECTOR ) {
				buf.push(chr);
			} else if ( context & ( constants.CONTEXT_OPEN_ATTRIBUTE_NAME |
									constants.CONTEXT_OPEN_ATTRIBUTE_VALUE |
									constants.CONTEXT_OPEN_DECLARATION_BODY ) ) {

				buf.push(chr);

				if ( !isWhitespace && (context & constants.CONTEXT_OPEN_DECLARATION_BODY) ) {
					addAttribute( ast );
					context = constants.CONTEXT_OPEN_ATTRIBUTE_NAME;
				}
			} else if ( context & constants.CONTEXT_CLOSE_ATTRIBUTE_NAME ) {
				buf.push(chr);
				context = constants.CONTEXT_OPEN_ATTRIBUTE_VALUE;
			} else if ( !isWhitespace && context & constants.CONTEXT_CLOSE_ATTRIBUTE_VALUE ) {
				addAttribute( ast );
				buf.push(chr);
				context = constants.CONTEXT_OPEN_ATTRIBUTE_NAME;
			}
		}
	}

	return parser( str, ++idx, ast, buf, context );
};


module.exports = (css) => {
	return parser(css, 0);
};
