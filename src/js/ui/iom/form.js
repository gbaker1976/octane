import { IomNode } from '../../ui/iom/iomnode';
import { consts } from '../../ui/iom/consts';

export class FormNode extends IomNode {
    constructor( options ){
        super({
			type: consts.NODETYPES.IOM
		});
    };
};
