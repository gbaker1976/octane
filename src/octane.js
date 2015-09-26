import { Factory } from "factory";
import { View } from "ui/view";
import { Repository } from "data/repository";
import { MessageBus } from "bus";
import { Registry } from "registry";
import { Aspect } from "aspect";
import { Worker } from "worker";
import { Mapper } from "data/mapper";

var _registry = new Registry();

class Octane {
	get Factory() { return Factory };
	get MessageBus() { return MessageBus };
	get Repository() { return Repository };
	get View() { return View };
	get Aspect() { return Aspect };
	get Worker() { return Worker };
	get Mapper() { return Mapper };
};

return Octane;
