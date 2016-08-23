'use strict';

import _ from 'lodash';
import Events from './events.model';

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

function respondWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			res.status(statusCode).json(entity);
		}
		return null;
	};
}

function respondWithAll(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		return Events.find().exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
	};
}

function saveUpdates(updates) {
	return function(entity) {
		var updated = _.merge(entity, updates);
		updated.queue = updates.queue;
		console.log(updated);
		return updated.save({new : true})
			.then(updated => {
				return updated;
			});
	};
}

function removeEntity(res) {
	return function(entity) {
		if (entity) {
			return entity.remove()
				.then(respondWithAll(res, 200));
		}
	};
}

function handleEntityNotFound(res) {
	return function(entity) {
		if (!entity) {
			res.status(404).end();
			return null;
		}
		return entity;
	};
}

// Gets a list of Events
export function index(req, res) {
	return Events.find().exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets a single event from the DB
export function show(req, res) {
	return Events.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Creates a new Events in the DB
export function create(req, res) {
	return Events.create(req.body)
		.then(respondWithAll(res, 201))
		.catch(handleError(res));
}

// Updates an existing Events in the DB
export function update(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	return Events.findById(req.params.id)
		.exec()
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Deletes a Events from the DB
export function destroy(req, res) {
	return Events.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}
