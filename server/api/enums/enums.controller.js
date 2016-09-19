'use strict';

import _ from 'lodash';
import Enums from './enums.model';

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

function respondAsFormattedKeyValuePair(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			var formatted = {};
			for (var i = 0; i < entity.length; i++)
			{
				formatted[entity[i].key] = entity[i].value;
			}

			res.status(statusCode).json(formatted);
		}
		return null;
	};
}

function respondWithTypeNames(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			var names = [];
			for (var i = 0; i < entity.length; i++)
			{
				names[i] = entity[i].value;
			}

			res.status(statusCode).json(names);
		}
		return null;
	};
}

function respondWithAll(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		return Enums.find().exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
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

// Gets a list of enums
export function index(req, res) {
	return Enums.find().sort({type : 1}).exec()		
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets a single enum from the DB
export function show(req, res) {
	return Enums.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets all enums of a certain type and return as an array of key-value pairs
export function getByType(req, res) {
	return Enums.find({
		type : req.params.type
	}).sort('value')
		.exec()
		.then(handleEntityNotFound(res))
		.then(respondAsFormattedKeyValuePair(res, 200))
		.catch(handleError(res));
}

// Gets all enums of a certain type and return the name values only
export function getByTypeNames(req, res) {
	return Enums.find({
		type : req.params.type
	}).exec()

		.then(handleEntityNotFound(res))
		.then(respondWithTypeNames(res, 200))
		.catch(handleError(res));
}

// Gets all enums of a certain type and return everything
export function getByTypeAll(req, res) {
	return Enums.find({
		type : req.params.type
	}).exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Creates a new enum in the DB
export function create(req, res) {
	return Enums.create(req.body)
		.then(respondWithAll(res, 201))
		.catch(handleError(res));
}

// Updates an existing enum in the DB
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
