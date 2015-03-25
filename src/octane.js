import { Factory } from "core/factory";
import { View } from "core/view";
import { Repository } from "core/repository";
import { MessageBus } from "core/bus";
import { Registry } from "core/registry";
import { Aspect } from "core/aspect";
import { Worker } from "core/worker";
import { Mapper } from "core/mapper";

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
