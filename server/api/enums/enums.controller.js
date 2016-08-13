'use strict';

import _ from 'lodash';
import Enums from './enums.model';

function respondWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			res.status(statusCode).json(entity);
		}
		return null;
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

function handleEntityNotFound(res) {
	return function(entity) {
		if (!entity) {
			res.status(404).end();
			return null;
		}
		return entity;
	};
}

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

// Gets a list of Enums
export function index(req, res) {
	return Enums.find().exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets a single Enums from the DB
export function show(req, res) {
	return Enums.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets all enums of a certain type
export function getByType(req, res) {
	return Enums.find({
		type : req.params.type
	}).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}


// Creates a new Enums in the DB
export function create(req, res) {
	return Enums.create(req.body)
		.then(respondWithResult(res, 201))
		.catch(handleError(res));
}

// Updates an existing Enums in the DB
export function update(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	return Enums.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Deletes a Enums from the DB
export function destroy(req, res) {
	return Enums.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}
