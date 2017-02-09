/*
 * css-ast finite state machine
 * v1.0
 * author: Garrett Baker
 */
import * as constants from './css-consts';

let addDeclaration = (ast, selectors, attributes) => {
	let len = ast.doc.push({
		selectors: selectors || [],
		attributes: attributes || []
	});

	ast.current = ast.doc[len-1];
};

let addAttribute = (ast, name, value) => {
	let len = ast.current.attributes.push({
		name: name || '',
		value: value || ''
	});
};

let addSelector = (ast, selector) => {
	if (selector) {
		ast.current.selectors.push(selector);
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
		if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_NAME ) {
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
		if ( context & constants.CONTEXT_OPEN_SELECTOR ) {
			return constants.CONTEXT_CLOSE_SELECTOR;
		}

		if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_VALUE ) {
			buf.push(str[idx]);
			return context;
		}
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

		if ( context & ( constants.CONTEXT_CLOSE_SELECTOR |
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
			if ( buf.length ) {
				ast.current.attributes[ast.current.attributes.length-1].value = buf.join('').trim();
				buf = [];
			}
		}
	} else {
		let isWhitespace = /\s/.test(chr);

		if ( isWhitespace && (context & ( constants.CONTEXT_OPEN_ATTRIBUTE_VALUE |
										    constants.CONTEXT_OPEN_SELECTOR ))) {
			buf.push(chr);
		} else {
			if ( null === context || context & constants.CONTEXT_CLOSE_DECLARATION_BODY ) {
				if ( !isWhitespace ) {
					addDeclaration( ast );
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

				if ( context & constants.CONTEXT_OPEN_DECLARATION_BODY ) {
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
// console.log(chr);
// console.log(context);
	return parser( str, ++idx, ast, buf, context );
};


module.exports = (css) => {
	return parser(css, 0);
};
