import { Factory } from "factory";
import { Surface } from "ui/surface";
import { Repository } from "data/tanker";
import { Pipeline } from "pipeline";
import { Registry } from "registry";
import { Foreman } from "foreman";

var _registry = new Registry();

class Octane {
	get Factory() { return Factory };
	get Pipeline() { return Pipeline };
	get Tanker() { return Tanker };
	get Surface() { return Surface };
	get Foreman() { return Foreman };
};

return Octane;
