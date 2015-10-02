// import { DomRenderer } from '../../src/js/ui/renderer/dom';
// import { IomNode } from '../../src/js/ui/iom/iomnode';
// import { TextNode } from '../../src/js/ui/iom/textnode';
// import { consts } from '../../src/js/ui/iom/consts';
//
// let assert = require( 'assert' );
//
// describe( 'DomRenderer Test', function() {
//
//   describe( '#render()', function () {
//     it( 'should render node tree', function ( done ) {
//         let node1 = new IomNode( 'div' );
//         let node2 = new IomNode( 'div' );
//         let textNode = new TextNode( 'foo' );
//         let renderer = new DomRenderer();
//
//         node2.children = [textNode];
//         node1.children = [node2];
//
//         assert( renderer.render( node1 ) === '<div><div>foo</div></div>', 'DomRenderer does not render node tree!' );
//         done();
//     });
//
//     it( 'should deep render node tree', function ( done ) {
//         let node1 = new IomNode( 'div' );
//         let node2 = new IomNode( 'div' );
//         let textNode = new TextNode( 'foo' );
//         let renderer = new DomRenderer();
//
//         node2.children = [textNode];
//         node1.children = [node2];
//
//         assert( renderer._deepRender( node1 ) === '<div><div>foo</div></div>', 'DomRenderer does not deep render node tree!' );
//         done();
//     });
//   });
//
// });
