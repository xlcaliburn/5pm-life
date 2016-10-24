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
	return (entity) => {
		var updated = _.merge(entity, updates);
		return updated.save();
	};
}

// ========================================

function pickVenue(activityId, param) {
	Venues
		.find({
			allowed_activities : activityId
		}).exec()
		.then((venues) => {
			if (venues.length > 0) {
				var index = Math.floor((Math.random() * venues.length));
				return venues[index];
			}
		})
	;
}

function addQueueToEvent(queueId, ev) {
	ev.queue.push(queueId);
	Queue.findById(queueId).exec()
		.then(saveUpdates({status : 'Pending'}))
		.catch((err) => {console.log(err);})
	;

	Events.findByIdAndUpdate(ev._id, { queue : ev.queue }).exec();
}

/////////////////////

function createNewEvent(queue) {
	var activity, venue;
	return Activities.find({
			tags : {$in : queue.search_parameters.tags}
		}).exec()
		.then(activities => {
			if (activities.length > 0) {
				var index = Math.floor((Math.random() * activities.length));
				activity = activities[index];
				return activity;
			}

		})
		.then(activity => {
			return Venues
				.find({
					allowed_activities : activity._id
				}).exec()
				.then((venues) => {
					if (venues.length > 0) {
						var index = Math.floor((Math.random() * venues.length));
						venue = venues[index];
						return venue;
					}
				})
			;
		})
		.then(() => {
			var newEvent = {
				dt_start : queue.search_parameters.event_search_dt_start,
				dt_end : queue.search_parameters.event_search_dt_end,
				dt_search_start : new Date(),
				activity : activity,
				venue : venue,
				status : 'New'
			};
			console.log(newEvent);
			return Events.create(newEvent)
				.then((ev) => {	return addQueueToEvent(queue._id, ev); })
			;
		})
	;
}

function findEvent(queue) {
	var param = queue.search_parameters;

	Events
		.find({
			'status' : 'New',
			dt_start : { $lte : param.event_search_dt_start },
			dt_end : { $gte : param.event_search_dt_end }
			// TODO: Length of Queue < Venue.Allowed_Capacity
		})
		// More Conditions
		.then((events) => {
			// If no eligible events
			if (events.length === 0) {
				return createNewEvent(queue);
			}
			else {
				return addQueueToEvent(queue._id, events[0]);
			}
		})
		.catch((err) => {console.log(err);})
	;
}

function clearEmptyEvents() {
	Events
		.remove({
			'users' : { $size: 0 },
			'queue' : { $size: 0 }
		}).exec()
		.catch((err) => {console.log(err);})
	;
}

export function rebalance(req, res) {
	// TODO
}

export function matchmake(req, res) {
	clearEmptyEvents();
	rebalance();

	Queue
		.find({'status' : 'Searching'}).exec()
		.then((queues) => {
			for (var queue in queues) {
				findEvent(queues[queue]);
			}
			return res;
		})
		.catch(() => handleError(res))
	;

	return res.sendStatus(200);
}
