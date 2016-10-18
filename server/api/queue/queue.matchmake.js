'use strict';

import _ from 'lodash';
import Queue from './queue.model';
import Events from '../events/events.model';
import Activities from '../activities/activities.model';
import Venues from '../venues/venues.model';
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

// ========================================

function pickActivity(param) {
	Activities
		.find({
			tags : {$in : param.tags}
		})
		.then(function(activities){
			if (activities.length > 0) {
				var index = Math.floor((Math.random() * activities.length));
				return activities[index];
			}
		})
	;
}

function pickVenue(activity, param) {
	// TODO: Hook up with actual Venues
	return {venue_name: 'test'};
}


function addQueueToEvent(queueId, ev) {
	ev.queue.push(queueId);
	Queue.findById(queueId).exec()
		.then(saveUpdates({status : 'Pending'}))
		.catch(function(err) {console.log(err);})
	;

	Events.findByIdAndUpdate(ev._id, { queue : ev.queue }).exec();
}

function findEvent(queue) {
	Events
		.find({
			'status' : 'New',
			dt_start : { $lte : queue.search_parameters.event_search_dt_start },
			dt_end : { $gte : queue.search_parameters.event_search_dt_end }
			// TODO: Length of Queue < Venue.Allowed_Capacity
		}).exec()
		// More Conditions
		.then(function(events) {
			// If no eligible events
			if (events.length === 0) {
				var activity = pickActivity(queue.search_parameters);
				var venue = pickVenue(activity, queue.search_parameters);

				var newEvent = {
					dt_start : queue.search_parameters.event_search_dt_start,
					dt_end : queue.search_parameters.event_search_dt_end,
					activity : activity,
					venue : venue,
					status : 'New'
				};

				Events.create(newEvent)
					.then(function(ev){
						addQueueToEvent(queue._id, ev);
					})
				;
			}
			else {
				addQueueToEvent(queue._id, events[0]);
			}
		})
		.catch(function(err) {console.log(err);})
	;
}

function clearEmptyEvents() {
	Events
		.remove({
			'users' : { $size: 0 },
			'queue' : { $size: 0 }
		}).exec()
		.catch(function(err) {console.log(err);})
	;
}

export function test(req, res) {
	pickActivity({tags:['Social']});

	return res.sendStatus(200);
}

export function matchmake(req, res) {
	clearEmptyEvents();

	Queue
		.find({'status' : 'Searching'}).exec()
		.then(function(queues){
			for (var queue in queues) {
				findEvent(queues[queue]);
			}
			return res;
		})
		.catch(()=>handleError(res))
	;

	return res.sendStatus(200);
}
