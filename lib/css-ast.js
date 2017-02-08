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

let tokens = {
	'{': (str, idx, ast, buf, context) => {
		if ( context & constants.CONTEXT_OPEN_SELECTOR ) {
			return constants.CONTEXT_OPEN_DECLARATION_BODY;
		}
	},
	'}': (str, idx, ast, buf, context) => {
		if ( context & constants.CONTEXT_OPEN_DECLARATION_BODY ) {
			return constants.CONTEXT_CLOSE_DECLARATION_BODY;
		}
	},
	':': (str, idx, ast, buf, context) => {
		if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_NAME ) {
			return constants.CONTEXT_CLOSE_ATTRIBUTE_NAME;
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

		if ( context & ( constants.CONTEXT_CLOSE_SELECTOR | constants.CONTEXT_OPEN_DECLARATION_BODY ) ) {
			ast.current.selectors.push(buf.join('').trim());
			buf = [];
		} else if ( context & constants.CONTEXT_CLOSE_ATTRIBUTE_NAME ) {
			ast.current.attributes[ast.current.attributes-1].name = buf.join('').trim();
		} else if ( context & constants.CONTEXT_CLOSE_ATTRIBUTE_VALUE ) {
			ast.current.attributes[ast.current.attributes-1].value = buf.join('').trim();
		}

	} else {
		if ( /\s/.test(chr) && context & ( constants.CONTEXT_OPEN_ATTRIBUTE_VALUE |
										   constants.CONTEXT_OPEN_SELECTOR )) {
			buf.push(chr);
		} else {
			if ( null === context || context & constants.CONTEXT_OPEN_SELECTOR ) {
				buf.push(chr);
				if ( null === context ) {
					addDeclaration( ast );
					context = constants.CONTEXT_OPEN_SELECTOR;
				}
			} else if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_NAME ) {
				buf.push(chr);
			} else if ( context & constants.CONTEXT_OPEN_ATTRIBUTE_VALUE ) {
				buf.push(chr);
			}
		}
	}

	return parser( str, ++idx, ast, buf, context );
};


module.exports = (css) => {
	return parser(css, 0);
};
