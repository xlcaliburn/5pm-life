/**
* Thing model events
*/

'use strict';

import {EventEmitter} from 'events';
import Thing from './thing.model';
var ThingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ThingEvents.setMaxListeners(0);

function emitEvent(event) {
    return function(doc) {
        ThingEvents.emit(event + ':' + doc._id, doc);
        ThingEvents.emit(event, doc);
    };
}

// Model events
var events = {
    'save': 'save',
    'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
    var event = events[e];
    Thing.schema.post(e, emitEvent(event));
}



export default ThingEvents;
