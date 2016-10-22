'use strict';

import _ from 'lodash';
import Queue from './queue.model';
import User from '../user/user.model';
import Events from '../events/events.model';
import jwt from 'jsonwebtoken';
import config from '../../config/environment';
import mongoose from 'mongoose';

var EmailTemplate = require('../email/templates/email.global');
var emailCtrl = require('../email/email.controller');

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
		console.log(err);
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

/* Check if user in queue
=====================================*/
function getDecodedToken(token) {
	if (!token) {
		return false;
	}

	var verified_token = false;
	try {
		verified_token = jwt.verify(token, config.secrets.session);
	} catch (err) {
		console.log(err);
	}

	return verified_token;
}

export function getUserStatus(req, res) {
	var response = { status: 'ok' };

	var token = getDecodedToken(req.params.token);
	if (!token) {
		return res.json({ response: 'unauthorized' });
	}

	// check queue to see if user is in queue
	// and return status
	return User.findOne({ _id: token._id }).exec()
		.then(function(user) {
			if (!user.event_status) {
				response.queue = -1;
				return res.json({ response: response });
			}

			if (user.current_event) {
				response.event_link = user.current_event;
			}

			return Events.findOne({ _id: user.current_event }).exec()
			.then((event)=> {
				if (event) {
					response.event = {
						activity: event.activity.activity_name,
						venue: event.venue.venue_name
					};
				}
				response.status = 'ok';
				response.queue_status = user.event_status;
				return res.json({ response: response });
			});


		})
		.catch(function(err) {
			response.status = 'error';
			response.errors = err;
			return res.json({ response: response });
		});

}


/*=====================================*/

/* Add to Queue
=====================================*/
// Validate queue data
function validateQueueData(queue_data) {
	var response = {};

	// TODO: check if user has token

	// TODO: check if user already is in a queue

	// TODO: check if start date is on a friday or saturday

	// TODO: check if end date is on the same friday or saturday

	// TODO: check if the times are at least x amount of hours apart with start time < end time

	// TODO: check if activity type is in the list activity_tags enums

	// TODO: check if location is in the list location enums

	response.status = 'ok';
	return response;
}

// Creates a new Queue in the DB
export function create(req, res) {
	var response = { status: 'ok'};
	var queue_data = req.body;
	var queue_data_status = validateQueueData(queue_data);

	if (queue_data_status.status !== 'ok') {
		return res.json({ response: response });
	}

	// extract user_id from token
	var token = req.body.token;
	if (!token) {
		return res.status(403).send('unauthorized');
	}

	var decoded_token = jwt.verify(token, config.secrets.session);

	var queue_object = {
		user: decoded_token._id,
		status: 'Searching',
		search_parameters: {
			tags: req.body.tags,
			event_search_dt_start: req.body.event_start,
			event_search_dt_end: req.body.event_end,
			city: req.body.city
		},
		queue_start_time: new Date()
	};

	return Queue.create(queue_object)
		.then(function() {
			return User.findById(decoded_token._id).exec()
			.then(function(user) {
				user.event_status = 'Pending';
				return user.save()
				.then(function() {
					res.json({ response: response });
					return res;
				});
			});
		})
		.catch(()=>handleError(res));
}
/*=====================================*/

/* Cancel user event search
=======================================*/

export function cancelEventSearch(req, res) {
	var response = { status: 'ok' };
	var token = getDecodedToken(req.params.token);

	return Queue.findOne({ user: token._id }).exec()
	.then(function(queue) {
		if (!queue) {
			return res.status(403).send('unauthorized');
		}
		var queue_id = queue._id;
		return Queue.remove({ _id: queue_id }).exec()
		.then(function() {
			// change user event_status = null
			return User.findById(token._id).exec()
			.then(function(user) {
				user.event_status = null;
				return user.save()
				.then(function() {
					return res.json({ response: response });
				});
			});
		});
	}).catch(handleError(res));
}

/*======================================*/
var io;
export default function(socketio) {
	io = socketio;
}

function saveUserEventStatus(user, event_id) {
	return User.update({_id: user._id }, { $set: { event_status: 'Pending User Confirmation', current_event: event_id }}).exec()
	.then(()=> {
		io.sockets.in(user._id).emit('update_status');
	});
}

// send confirmation email + add users to event
export function triggerEvent(req, res) {
	var response = {};
	var queue = req.body.queues;
	var event_id = req.body.event_id;
	var query_array = [];
	var users_array = [];

	for (var i = 0; i < queue.length; i++) {
		//var query_obj = new mongoose.Types.ObjectId(queue[i]);
		//query_array.push(query_obj);
		query_array.push(queue[i]);
	}

	return Queue.find({ _id : { $in: query_array }}).exec()
	 	.then(function(queue_items) {
			var user_array = [];
			for (var j = 0; j < queue_items.length; j++) {
				user_array.push(queue_items[j].user);
			}

			return User.find({_id: { $in: user_array }});
		})
		.then(function(users) {
			for (var k = 0; k < users.length; k++) {
				// send emails to all users
				var url_origin = req.headers.origin;
				url_origin = url_origin.replace('http://', 'http://www.');
				var email_data = {
	                first_name: users[k].first_name,
									template: 'event-confirmation',
	                event_link: url_origin + '/home/event/' + event_id
	            };

				var text_version = EmailTemplate.get_text_version(email_data);
				var html_version = EmailTemplate.get_html_version(email_data);

	            var email_content = {
	                to: users[k].email,
	                subject: '[5PMLIFE] An event has been found!',
	                text: text_version,
	                html: html_version
	            };

	            emailCtrl.sendEmail(email_content);

				// add users to event
				var user_obj = new User(users[k]);
				users_array.push(user_obj);

				saveUserEventStatus(user_obj, event_id);
			}
			return Events.findById(event_id);
		})
		.then(function(event) {
			event.users = users_array;
			event.save()
				.then(function() {
					response.status = 'ok';
					return res.json({ response: response });
				});
			return null;
		})
		.catch(function(err) {
			return res.json({ error: err });
		});

}

// Updates an existing Queue in the DB
export function update(req, res) {
	console.log('Updating...', req.params.id, req.body);
	if (req.body._id) {
		delete req.body._id;
	}
	return Queue.findById(req.params.id).exec()
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
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
