
let arrayWalker = ( context, arr, idx, f, html ) => {
	html = html || '';

	if ( !arr || arr.length-1 < idx || idx < 0 ) {
		return html;
	}

	html += f( context, arr[idx] );

	return arrayWalker( context, arr, ++idx, f, html );
};

let el = ( context, node ) => {
	let h = '';

	if ( !node ){
		return '';
	}

	//process children
	if ( context === node.context || '*' === context || '*' === node.context || !node.context ) {
		switch ( node.type ) {
			case 'element' :
				if ( node.children && node.children.length ) {
					h = arrayWalker( context, node.children, 0, el );
				} // TODO: add code for nodes with no children
				break;
			case 'text' :
				return node.value;
				break;
		}
	} else {
		return '';
	}

	return '<' + node.name + '>' + h + '</' + node.name + '>';
};

module.exports = {
	render: function( context, ast ){
		return el( context, ast );
	},
	arrayWalker: arrayWalker,
	el: el
};
