const CONTEXT_OPEN_TAG = 0;
const CONTEXT_CLOSE_TAG = 1;
const CONTEXT_OPEN_ELEMENT = 2;
const CONTEXT_CLOSE_ELEMENT = 4;
const CONTEXT_OPEN_COMMENT = 8;
const CONTEXT_CLOSE_COMMENT = 16;
const CONTEXT_OPEN_TEXT = 32;
const CONTEXT_CLOSE_TEXT = 64;
const CONTEXT_OPEN_PARAM_NAME = 128;
const CONTEXT_CLOSE_PARAM_NAME = 256;
const CONTEXT_PARAM_NAME_DELIMIT = 512;
const CONTEXT_OPEN_PARAM_VALUE = 1024;
const CONTEXT_CLOSE_PARAM_VALUE = 2048;
const CONTEXT_OPEN_DECL = 4096;

const NODETYPE_ELEMENT = 0;
const NODETYPE_COMMENT = 1;
const NODETYPE_TEXT = 2;
const NODETYPE_PARAM = 4;
const NODETYPE_PARAM_VALUE = 8;
const NODETYPE_DECL = 16;

let tokens = {
	'<': (str, idx, ast, context) => {
		let len = 0;
		if ( !context ||
			 context === CONTEXT_CLOSE_TAG ||
		 	 context === CONTEXT_CLOSE_COMMENT ||
		 	 context === CONTEXT_CLOSE_TEXT ) {

			len = ast.current.children.push({
				name: '',
				type: ''
			});

			ast.current = ast.current.children[len-1];
			return CONTEXT_OPEN_TAG;
		}
	},
	'>': (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_DECL ) {
			return CONTEXT_CLOSE_DECL;
		} else if ( context === CONTEXT_OPEN_COMMENT ) {
			return CONTEXT_CLOSE_COMMENT;
		} else if ( context === CONTEXT_OPEN_TAG ) {
			return CONTEXT_CLOSE_TAG;
		}

		return context;
	},
	'/': (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_COMMENT ) {
			ast.current.value += str[idx];
		}

		return context;
	},
	'=': (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_COMMENT ) {
			ast.current.value += str[idx];
		}

		return context;
	},
	' ': (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_COMMENT ) {
			ast.current.value += str[idx];
		}

		return context;
	},
	'"': (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_COMMENT ) {
			ast.current.value += str[idx];
		}

		return context;
	},
	"'": (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_COMMENT ) {
			ast.current.value += str[idx];
		}

		return context;
	},
	'!': (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_TAG ) {
			// may be a directive or comment
			ast.current.type = NODETYPE_DECL;
			return CONTEXT_OPEN_DECL;
		} else if ( context === CONTEXT_OPEN_COMMENT ) {
			ast.current.value += str[idx];
		}

		return context;
	},
	'-': (str, idx, ast, context) => {
		if ( context === CONTEXT_OPEN_DECL ) {
			if ( '-' == str[idx-1] ) {
				ast.current.type = NODETYPE_COMMENT;
				if ( !ast.current.value ) {
					ast.current.value = '';
				}
				return CONTEXT_OPEN_COMMENT;
			} else {
				return CONTEXT_OPEN_DECL;
			}
		} else if ( context === CONTEXT_OPEN_COMMENT ) {
			ast.current.value += str[idx];
		}

		return context;
	}
};
let parser = (str, idx, ast, context) => {
	let chr;

	if ( !context && context !== 0 ) {
		context = null;
	}

	ast = ast || {
		current: null,
		children: []
	};
	ast.current = ast;

	if ( !str || idx < 0 || str.length-1 < idx ) {
		return ast;
	}

	chr = str[idx];

	if (tokens[chr]) {
		context = tokens[chr]( str, idx, ast, context );
		console.log(context);
	} else {
		if ( context === CONTEXT_OPEN_TEXT || context === CONTEXT_OPEN_COMMENT || context === CONTEXT_OPEN_PARAM_VALUE ) {
			ast.current.value += chr;
		} else if ( context === CONTEXT_OPEN_TAG || context === CONTEXT_OPEN_PARAM_NAME || context === CONTEXT_OPEN_DECL ) {
			ast.current.name += chr;
		}
	}

	return parser( str, ++idx, ast, context );
};


module.exports = (html) => {
	return parser(html, 0);
};
