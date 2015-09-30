import { IomNode } from '../../ui/iom/iomnode';
import { consts } from '../../ui/iom/consts';

export class EmptyNode extends IomNode {
    constructor(){
        super();
        this._type = consts.NODETYPES.TEXT;
    };
	render(){
        return '';
    };
};
