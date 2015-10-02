// import { consts } from '../../ui/iom/consts';
//
// export class DomRenderer {
//     constructor(){};
//
//     _renderStartTag( node ){
//         return node.name ? '<' + node.name + '>' : '';
//     };
//
//     _renderEndTag( node ){
//         return node.name ? '</' + node.name + '>' : '';
//     };
//
//     _deepRender( iomNode ){
//         let renderer = ( node ) => {
//             let html = '';
//             let i = 0;
//             let n;
//
//             switch ( node.type ) {
//                 case consts.NODETYPES.TEXT :
//                     html = node.render();
//                     break;
//                 default :
//                     if ( node.name ) {
//                         html += this._renderStartTag( node );
//                     }
//
//                     while ( n = node.children[ i++ ] ) {
//                         html += renderer( n );
//                     }
//
//                     if ( node.name ) {
//                         html += this._renderEndTag( node );
//                     }
//             }
//
//             return html;
//         };
//
//         return renderer( iomNode );
//     };
//
//     render( node ){
//         return this._deepRender( node );
//     };
// };
