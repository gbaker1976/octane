import { IomNode } from '../../ui/iom/iomnode';
import { consts } from '../../ui/iom/consts';

export class TextNode extends IomNode {
    constructor( text ){
        super();
		var priv = this.props.get(this);
		priv.text = val;
		priv.name = val;
        priv.type = consts.NODETYPES.TEXT;
    };

	get text() {
        return this.props.get(this).text;
    };

	render(){
        return this.text || '';
    };
};
