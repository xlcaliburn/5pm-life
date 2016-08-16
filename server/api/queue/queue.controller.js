'use strict';

import _ from 'lodash';
import Queue from './queue.model';
import jwt from 'jsonwebtoken';
import config from '../../config/environment';

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

// Gets a list of Queue
export function index(req, res) {
	return Queue.find()
		.populate('user', 'email first_name last_name role birthday gender')
		.exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets a single Queue from the DB
export function show(req, res) {
	return Queue.findById(req.params.id)
		.populate('user', 'email first_name last_name role birthday gender')
		.exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

export function getByStatus(req, res) {
	return Queue.find({status : req.params.status})
		.populate('user', 'email first_name last_name role birthday gender')
		.exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}
/* Add to Queue
=====================================*/
// Validate queue data
function validateQueueData(queue_data) {
	var response = {};

	// TODO: check if user has token

	// TODO: check if user already is in a queue

	// TODO: check if start date is on a saturday

	// TODO: check if end date is on the same saturday

	// TODO: check if the times are at least x amount of hours apart with start time < end time

	// TODO: check if activity type is in the list activity_tags enums

	// TODO: check if location is in the list location enums

	response.status = 'ok';
	return response;
}

// Creates a new Queue in the DB
export function create(req, res) {
	var response = {};
	var queue_data = req.body;
	var queue_data_status = validateQueueData(queue_data);

	if (queue_data_status.status !== 'ok') {
		return res.json({ response: response });
	}

	// extract user_id from token
	var token = req.body.token;
	if (!token) {
		return res.json({ response: 'unauthorized' });
	}

	var decoded_token = jwt.verify(token, config.secrets.session);

	var queue_object = {
		user: decoded_token._id,
		status: 0,
		search_parameters: {
			tags: req.body.tags,
			event_search_dt_start: req.body.event_start,
			event_search_dt_end: req.body.event_end,
			city: req.body.city
		},
		queue_start_time: new Date()
	};

	return Queue.create(queue_object)
		.then(function(result) {
			response.status = 'ok';
			response.result = result;
			return res.json({ response: response });
		})
		.catch(function(err, result) {
			response.status = 'error';
			response.errors = err;
			response.result = result;
			return res.json({ response: response });
		});
}

/*=====================================*/


// Updates an existing Queue in the DB
export function update(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	return Queue.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

export function updateMultipleStatus(req, res) {
	return Queue.find()
		.populate('user', 'email first_name last_name role birthday gender')
		.exec()
		.then(respondWithResult(res))
		.catch(handleError(res));	
}

// Deletes a Queue from the DB
export function destroy(req, res) {
	return Queue.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.catch(handleError(res));
}
