'use strict';

import _ from 'lodash';
import Events from './events.model';
import User from '../user/user.model';
import Queue from '../queue/queue.model';
import mongoose from 'mongoose';

var userController = require('../user/user.controller');
var EmailTemplate = require('../email/templates/email.global');
var emailCtrl = require('../email/email.controller');

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log('error is', err);
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

// user confirms event inside event confirmation
export function confirmEvent(req, res) {
	var response = {};
	var email_data = req.body;
	var token = req.cookies.token;
	var token_result = userController.getDecodedToken(token);
	var user_id = new mongoose.Types.ObjectId(token_result._id);

	// remove user from queue
	return Queue.findOne({ user: user_id }).exec()
	.then(function(queue) {
		var queue_id = queue._id;

		// remove queue
		return Queue.remove({ _id: queue_id }).exec()
		.then(()=>{
			// update user event_status to 'Confirmed'
			return User.findById(token_result._id).exec()
			.then((user)=>{
				user.event_status = 'Confirmed';
				return user.save()
				.then(function() {

					return Events.findById(email_data.id).exec()
					.then((event)=>{

						// remove corresponding queue from event
						event.queue.remove(queue_id);
						return event.save()
						.then(()=>{

						// send email to user with event details
							email_data.template = 'event-confirmation-accept';
							email_data.first_name = user.first_name;
							email_data.event_link = req.headers.origin + '/home/event/' + email_data.id;

							var text_version = EmailTemplate.get_text_version(email_data);
							var html_version = EmailTemplate.get_html_version(email_data);
							var email_content = {
								to: user.email,
								subject: '[5PMLIFE]' + email_data.activity + ' at ' + email_data.venue,
								text: text_version,
								html: html_version
							};

							emailCtrl.sendEmail(email_content);
							response.status = 'ok';
							return res.json({ response: response });
						})
						.catch(handleError(res));
					})
					.catch(handleError(res));
				})
				.catch(handleError(res));
			})
			.catch(handleError(res));
		})
		.catch(handleError(res));
	})
	.catch(handleError(res));
}

// user declines an event inside event confirmation
export function declineEvent(req, res) {
	var response = {};
	var event_id = req.body.id;
	var token = req.cookies.token;
	var token_result = userController.getDecodedToken(token);

	// Queue table - change user status to 'Pending'
	var user_id = new mongoose.Types.ObjectId(token_result._id);
	return Queue.findOne({ user: user_id }).exec()
	.then(function(queue) {
		if (!queue) {
			return res.status(403).send('unauthorized');
		}
		var queue_id = queue._id;
		queue.status = 'Searching';
		return queue.save()
		.then(function() {


			return Events.findById(event_id).exec()
			.then(function(event) {

				// Event table - remove user and queue from event
				event.users.remove(user_id);
				event.queue.remove(queue_id);
				return event.save()
				.then(function() {

					// User table - Change event_status and current_event to null
					return User.findById(token_result._id).exec()
					.then(function(user) {
						user.event_status = 'Pending';
						user.current_event = null;
						return user.save()
						.then(function() {
							response.status = 'ok';
							return res.json({ response: response });
						})
						.catch(handleError(res));
					})
					.catch(handleError(res));
				})
				.catch(handleError(res));
			})
			.catch(handleError(res));
		})
		.catch(handleError(res));
	})
	.catch(handleError(res));
}

// leave event after accepting
export function leaveEvent(req, res) {
	var response = { status: 'ok' };
	var event_id = req.body.id;
	var token = req.cookies.token;
	var user_id = userController.getDecodedToken(token)._id;
	var user_obj_id = new mongoose.Types.ObjectId(user_id);

	// User - change event_status = null
	// User - change current_event = null
	return User.findById(user_id).exec()
	.then((user)=> {
		user.event_status = null;
		user.current_event = null;
		return user.save()
		.then(()=>{
			// Event - remove user from event
			return Events.findById(event_id).exec()
			.then((event)=>{
				event.users.remove(user_obj_id);
				return event.save()
				.then(()=>{
					return res.json({ response: response });
				})
				.catch(handleError(res));
			})
			.catch(handleError(res));
		})
		.catch(handleError(res));
	})
	.catch(handleError(res));
}

// get attendees based on event_id
export function getAttendees(req, res) {
	var response = {};
	var event_id = req.params.event_id;
	var token = req.cookies.token;

	if (!token) {
		return res.status(403).send('Unauthorized');
	}
	else {
		var token_result = userController.getDecodedToken(token);
	}

	return Events.findById(event_id).exec()
		.then(function(event) {

			// fetch all of the users based on their ObjectId
			var user_array = event.users;
			return User.find({ _id: { $in: user_array }}).exec()
				.then(function(users) {
					var confirmed_users = [];
					var isAllowed = false;
					var current_user;

					// check if user is allowed to view event
					for (var i = 0; i < users.length; i++) {
						var user_id = users[i]._id.toString();
						if (user_id === token_result._id) {
							isAllowed = true;
							current_user = {
								name: users[i].first_name + ' ' + users[i].last_name,
								profile_picture: users[i].profile_picture.current,
								status: users[i].event_status
							};
							confirmed_users.push(current_user);
							continue;
						}

						if (users[i].event_status === 'Confirmed') {
							current_user = {
								name: users[i].first_name + ' ' + users[i].last_name,
								profile_picture: users[i].profile_picture.current
							};
							confirmed_users.push(current_user);
						}
					}

					if (!isAllowed) {
						return res.status(403).send('Unauthorized');
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
		})
		.catch(function(err) {
			response.status = 'error';
			response.error = err;
			return res.json({ response: response });
		});
}
