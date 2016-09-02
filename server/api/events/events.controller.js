'use strict';

import _ from 'lodash';
import Events from './events.model';
import User from '../user/user.model';
var userController = require('../user/user.controller');

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
	var response = {};
	return Events.findById(req.params.id, 'activity venue dt_start dt_end status').exec()
		.then(function(event) {
			if (!event) {
				response.status = 'error';
				return res.json({ response: response });
			}
			response.status = 'ok';
			response.event_model = event;
			return res.json({ response: response });
		})
		.catch(function(err) {
			response.status = 'error';
			response.error = err;
			return res.json({ response: response });
		});
}

// Admin level GetById
export function admin_show(req, res) {
	var response = {};
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

// get attendees based on event_id
export function getAttendees(req, res) {
	var response = {};
	var event_id = req.params.event_id;
	var token = req.cookies.token;
	var token_result = userController.getDecodedToken(token);

	if (!token) {
		response.status = 'unauthorized';
		return res.json({ response: response });
	}

	return Events.findById(event_id).exec()
		.then(function(event) {

			// fetch all of the users based on their ObjectId
			var user_array = event.users;
			return User.find({ _id: { $in: user_array }}).exec()
				.then(function(users) {
					var confirmed_users = [];
					var isAllowed = false;

					// check if user is allowed to view event
					for (var i = 0; i < users.length; i++) {
						if (users[i]._id == token_result._id) {
							isAllowed = true;
						}

						if (users[i].event_status == 'Confirmed') {
							var current_user = {
								name: users[i].first_name + ' ' + users[i].last_name,
								profile_picture: users[i].profile_picture.current
							}
							confirmed_users.push(current_user);
						}
					}

					if (!isAllowed) {
						response.status = 'unauthorized';
						return res.json({ response: response });
					}

					// everything is good, return the attendees
					response.status = 'ok';
					response.attendees = confirmed_users;
					return res.json({ response: response });
				})
				.catch(function(err) {
					response.status = 'error';
					return res.json({ response: response });
				});

			response.status = 'ok';
			response.attendees = confirmed_users;
			return res.json({ response: response });
		})
		.catch(function(err) {
			response.status = 'error';
			response.error = err;
			return res.json({ response: response });
		});
}
