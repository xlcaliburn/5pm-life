'use strict';

import _ from 'lodash';
import Events from './events.model';
import User from '../user/user.model';
import Queue from '../queue/queue.model';
import mongoose from 'mongoose';

var Chat = mongoose.model('Chat');
var Message = mongoose.model('Message');

var userController = require('../user/user.controller');
var EmailTemplate = require('../email/templates/email.global');
var emailCtrl = require('../email/email.controller');

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log('Error is', err);
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
	return Promise.resolve(Events.findById(req.params.id, 'activity venue dt_start dt_end status').exec())
	.then(function(event) {
		if (!event) {
			throw('No event found');
		}
		response.status = 'ok';
		response.event_model = event;
		return res.json({ response: response });
	})
	.catch(handleError(res));
}

// Admin level GetById
export function admin_show(req, res) {
	var response = {};
	return Events.findById(req.params.id)
	.populate('queue')
	.populate('users','first_name last_name gender birthday ethnicity')
	.exec()
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
	var current_event;
	var queue_id;
	var current_user;

	// remove user from queue
	return Promise.resolve(Queue.findOne({ user: user_id }).exec())
	.then((queue) => {
		if (!queue) { throw ('You have already confirmed this event!'); }
		queue_id = queue._id;
		return Promise.resolve(Queue.remove({ _id: queue_id }).exec()); // remove queue
	})
	.then(() => {
		return Promise.resolve(User.findById(token_result._id).exec());
	})
	.then((user) => {
		current_user = user;
		user.event_status = 'Confirmed';
		return user.save();
	})
	.then(() => {
		return Promise.resolve(Events.findById(email_data.id).exec());
	})
	.then((event) => {
		// remove corresponding queue from event
		if (!event) { throw ('No event found'); }
		current_event = event._id;
		event.queue.remove(queue_id);
		return event.save();
	})
	.then(() => {
		// find chat that corresponds to event, if none, create one
		return Promise.resolve(Chat.findOne({eventId: current_event }));
	})
	.then((chat) => {
		var message;
		if (!chat) {
			// create new chat
			message = new Message({
				user: current_user._id,
				message: 'has joined the event!',
				timestamp: new Date()
			});

			var chatroom = new Chat({
				eventId: current_event,
				messages: [message]
			});
			chatroom.save();
		} else {
			message = new Message({
			   	user: current_user._id,
			   	message: 'has joined the event!',
			   	timestamp: new Date()
			});
			chat.messages.push(message);
			chat.save();
		}
	})
	.then(() => {
		// send email to user with event details
		var url_origin = (req.headers.origin ? req.headers.origin.replace('http://', 'http://www.') : 'http://www.' + req.headers.host);

		email_data.template = 'event-confirmation-accept';
		email_data.first_name = current_user.first_name;
		email_data.event_link = url_origin + '/home/event/' + email_data.id;

		var text_version = EmailTemplate.get_text_version(email_data);
		var html_version = EmailTemplate.get_html_version(email_data);
		var email_content = {
			to: current_user.email,
			subject: '[5PMLIFE]' + email_data.activity + ' at ' + email_data.venue,
			text: text_version,
			html: html_version
		};

		emailCtrl.sendEmail(email_content);
		response.status = 'ok';
		return res.json({ response: response });
	})
	.catch(handleError(res));

}

// user declines an event inside event confirmation
export function declineEvent(req, res) {
	var response = {};
	var event_id = req.body.id;
	var token = req.cookies.token;
	var token_result = userController.getDecodedToken(token);
	var queue_id;

	// Queue table - change user status to 'Pending'
	var user_id = new mongoose.Types.ObjectId(token_result._id);

	return Promise.resolve(Queue.findOne({ user: user_id }).exec())
	.then((queue) => {
		if (!queue) {
			throw('Unauthorized');
		}
		queue_id = queue._id;
		queue.status = 'Searching';
		queue.save();
	})
	.then(function() {
		return Promise.resolve(Events.findById(event_id).exec());
	})
	.then((event) => {
		// Event table - remove user and queue from event
		event.users.remove(user_id);
		event.queue.remove(queue_id);
		event.save();
	})
	.then(() => {
		// User table - Change event_status and current_event to null
		return Promise.resolve(User.findById(token_result._id).exec());
	})
	.then((user) => {
		user.event_status = 'Pending';
		user.current_event = null;
		user.save();
	})
	.then(function() {
		response.status = 'ok';
		return res.json({ response: response });
	})
	.catch(handleError(res));
}

// leave event after accepting
export function leaveEvent(req, res) {
	var response = { status: 'ok' };
	var event_id = req.body.id;
	var token = req.cookies.token;
	var user_id = userController.getDecodedToken(token)._id;

	// User - change event_status = null
	// User - change current_event = null
	return Promise.resolve(User.findById(user_id).exec())
	.then((user)=> {
		user.event_status = null;
		user.current_event = null;
		user.save();
	})
	.then(() => {
		// Event - remove user from event
		return Promise.resolve(Events.findById(event_id).exec());
	})
	.then((event) => {
		event.users.remove(user_id);
		return event.save();
	})
	.then(() => {
		// send chat message
		var eventId = new mongoose.Types.ObjectId(event_id);
		return Promise.resolve(Chat.findOne({eventId: eventId}).exec());
	})
	.then((chat) => {
		var current_user = new mongoose.Types.ObjectId(user_id);
		var leave_message = new Message({
			user: current_user,
			message: 'has left the event.',
			timestamp: new Date()
		});
		chat.messages.push(leave_message);
		chat.save();
	})
	.then(()=>{
		return res.json({ response: response });
	}).catch(handleError(res));
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

	return Promise.resolve(Events.findById(event_id).exec())
	.then((event) => {
		// fetch all of the users based on their ObjectId
		var user_array = event.users;
		return Promise.resolve(User.find({ _id: { $in: user_array }}).exec());
	})
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
			throw('Unauthorized');
		}

		// everything is good, return the attendees
		response.status = 'ok';
		response.attendees = confirmed_users;
		return res.json({ response: response });
	})
	.catch(handleError(res));
}
