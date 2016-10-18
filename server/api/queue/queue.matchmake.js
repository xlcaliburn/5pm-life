'use strict';

import _ from 'lodash';
import Queue from './queue.model';
import Events from '../events/events.model';
import mongoose from 'mongoose';

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log(err);
		res.status(statusCode).send(err);
	};
}

function saveUpdates(updates) {
	return function(entity) {
		var updated = _.merge(entity, updates);
		return updated.save()
			.then(updated => {
				return updated;
			});
	};
}


function addQueueToEvent(queueId, ev)
{
	ev.queue.push(queueId);
	Queue.findById(queueId).exec()
		.then(saveUpdates({status : 'Pending'}));

	Events.findByIdAndUpdate(ev._id, { queue : ev.queue }).exec();
}

function findEvent(queue) {
	var eligibleEvents = [];
	console.log(queue);
	Events
		.find({
			'status' : 'New',
			dt_start : { $lte : queue.search_parameters.event_search_dt_start },
			dt_end : { $gte : queue.search_parameters.event_search_dt_end }
			// TODO: Length of Queue < Venue.Allowed_Capacity
		}).exec()
		// More Conditions
		.then(function(events) {
			addQueueToEvent(queue._id, events[0]);
		})
	;

}

export function matchmake(req, res) {
	var openQueues = [];
	var openEvents = [];
	Queue
		.find({'status' : 'Searching'}).exec()
		.then(function(queues){
            openQueues = queues;
			return res;
		})
		.then(function(){
			for (var queue in openQueues) {
				findEvent(openQueues[queue]);
			}
			return res;
		});
		return res.sendStatus(200);
}
