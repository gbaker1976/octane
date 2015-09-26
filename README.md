# Octane
Event driven UI framework that separates UI events from views, streamlines inter-layer communication onto a global message bus, and segments data access from data rendering.

## UI Framework

### Pipeline
The central nervous system of the application. All events pass along the pipeline and every layer of the application ties into it. Also, all DOM events are filtered into Pipeline.

### UI Event Dispatcher
Handles DOM events globally and pumps them into pipeline.

### Data Worker
An interface responsible for all API calls and data handling.

### View Model
An interface responsible for view data. Opaque and light weight, receives data and published changes that views respond to.

### Tanker
Serves as a facade for all data retreival, both local and remote. A multition that services requests for view models, it maintains a registry of workers and view models. When a model is requested, if it does not exist, the repository spins up the appropriate worker to fetch the data and then feeds that into the appropriate mapper. Once the data is in hand, it hydrates the proper model and returns it.

### Transaction
Represents a unit of work that performs data manipulation across many models and possibly across many APIs.

### Surface
Lightweight objects that simply render model data.

## Build Process

### Writing code

* All code is written is ES6. We use modules and classes heavily.
* All code has 100% test coverage.
* All code is 100% documented.

### Building

* Build task runner is GulpJS.
* All code is bundled for AMD support.
* All ES6 code is transpiled into ES5.
* Semantic versioning is used to tag releases.
