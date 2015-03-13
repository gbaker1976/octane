import { Factory } from "factory";
import { View } from "view";
import { Route } from "route";
import { Store } from "store";
import { MessageBus } from "bus";
import { Registry } from "registry";

var _registry = new Registry();

class Octane {
	get Factory() { return Factory };
	get MessageBus() { return MessageBus };
	get Store() { return Store };
	get Route() { return Route };
	get View() { return View };
};

return Octane;
