# Octane
Event driven UI framework that separates UI events from views, streamlines inter-layer communication onto a global message bus, and segments data access from data rendering.

## UI Framework

### MessageBus
The central nervous system of the application. All events pass along the bus and every layer of the application ties into it. Also, all DOM events are filtered into this bus.

### UI Event Dispatcher
Handles DOM events globally, thus, consolidating all event handling into the message bus.

### View Dispatcher
A dispatcher used by views to pass data down to subviews. Subviews register events with this dispatcher and all data flowing into the parent view is dispatched down to the appropriate subviews.

### Data Worker
An interface responsible for all CRUD to/from our APIs.

### Data Mapper
An interface responsible for mapping API properties to model properties. Can map 1-to-1 or many-to-1. This, the data worker, and the view model form the pipeline for getting data to views for render.

### View Model
An interface responsible for view data. Opaque and light weight, receives data and published changes that views respond to.

### View
Lightweight objects that simply render model data.

### Plugin
A module that exposes one or more aspects and services within the application.

### Aspect
The application is made up of aspects. A given plugin may expose it's own aspects for inclusion within the application. Comes in both intrinsic as well as plugin-specific flavors.

### Service
A task-specific facility. Comes in both intrinsic as well as plugin-specific flavors.

## Build Process

### Writing code

* All code is written is ES6. We use modules and classes heavily.
* All code has 100% test coverage.
* All code is covered by complexity tests as well.
* All code is 100% documented.

### Building

* Build task runner is GulpJS.
* All code is bundled for AMD support.
* All ES6 code is transpiled into ES5.
* Semantic versioning is used to tag releases.
