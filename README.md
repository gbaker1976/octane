# Octane
Event driven UI framework that separates UI events from views, streamlines inter-layer communication onto a global message bus, and segments data access from data rendering.

## MessageBus
The central nervous system of the application. All events pass along the bus and every layer of the application ties into it. Also, all DOM events are filtered into this bus.

## UI Event Dispatcher
Handles DOM events globally, thus, consolidating all event handling into the message bus.

## View Dispatcher
A dispatcher used by views to pass data down to subviews. Subviews register events with this dispatcher and all data flowing into the parent view is dispatched down to the appropriate subviews.

## Data Worker
An interface responsible for all CRUD to/from our APIs.

## Data Mapper
An interface responsible for mapping API properties to model properties. Can map 1-to-1 or many-to-1. This, the data worker, and the view model form the pipeline for getting data to views for render.

## View Model
An interface responsible for view data. Opaque and light weight, receives data and published changes that views respond to.

## View
Lightweight objects that simply render model data.
