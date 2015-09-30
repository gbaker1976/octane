import { IomNode } from '../../ui/iom/iomnode';
import { consts } from '../../ui/iom/consts';

export class TextNode extends IomNode {
    constructor( text ){
        super();
        this._text = text;
        this._type = consts.NODETYPES.TEXT;
    };

	render(){
        return this._text || '';
    };
};
