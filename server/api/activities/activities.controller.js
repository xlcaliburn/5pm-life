'use strict';

import _ from 'lodash';
import activities from './activities.model';

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

function removeEntity(res) {
	return function(entity) {
		if (entity) {
			return entity.remove()
			.then(() => {
				res.status(204).end();
			});
		}
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

function handleEntityNotFound(res) {
	return function(entity) {
		if (!entity) {
			res.status(404).end();
			return null;
		}
		return entity;
	};
}

// Gets a list of activities
export function index(req, res) {
	return activities.find().sort({type : 1}).exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets a single activity from the DB
export function show(req, res) {
	return activities.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets all activities of a certain type and return everything
export function getByTypeAll(req, res) {
	return activities.find({
		type : req.params.type
	}).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Creates a new activity in the DB
export function create(req, res) {
	return activities.create(req.body)
		.then(respondWithResult(res, 201))
		.catch(handleError(res));
}

// Updates an existing activity in the DB
export function update(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	return activities.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Deletes a activities from the DB
export function destroy(req, res) {
	return activities.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}
