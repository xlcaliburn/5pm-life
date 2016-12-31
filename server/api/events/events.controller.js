'use strict';

import _ from 'lodash';
import Events from './events.model';
import User from '../user/user.model';
import Queue from '../queue/queue.model';
import mongoose from 'mongoose';

var Chat = mongoose.model('Chat');
var Message = mongoose.model('Message');

var fs = require('fs');
var enumsJSON = fs.readFileSync(__dirname + '/../enums/enums.json');
var enums = JSON.parse(enumsJSON);

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

// Gets a list of live events
// TODO: Make this more generic on refactor
export function index(req, res) {
	return Events.find({'status' : {$ne : 'Ended'}}).sort({dt_search_start: -1})
	.exec()
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

export function getAllEvents(req, res){
	return Events.find().sort({dt_search_start: -1})
	.then(respondWithResult(res))
	.catch(handleError(res));
}

// Admin level GetById
export function admin_show(req, res) {
	return Events.findById(req.params.id)
	.populate([{
		path:'queue',
		populate: {
			path: 'users',
			select: 'first_name last_name gender birthday ethnicity'
		}
	},{
		path:'users',
		select: 'first_name last_name gender birthday ethnicity current_event'
	}])
	//.populate('users','first_name last_name gender birthday ethnicity')
	.exec()
	.then(handleEntityNotFound(res))
	.then(respondWithResult(res))
	.catch(handleError(res));
}

// Creates a new Events in the DB
export function create(req, res) {
	return Events.create(req.body)
	.then(() => {
		return index(req, res);
	})
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
	.then((event) => {
		if(event.users.length > 0){
			res.status(500).send('An event containing users cannot be deleted.');
			return null;
		}
		else{
			return Events.remove({_id: req.params.id})
			.then(() => {
				res.status(200).end();
				return null;
			});
		}
	})
	.catch(handleError(res));
}

// user confirms event inside event confirmation
export function confirmEvent(req, res) {
	var user = req.user;

	var email_data = req.body;
	var token = req.cookies.token;
	var token_result = userController.getDecodedToken(token);
	var user_id = new mongoose.Types.ObjectId(token_result._id);
	var current_event;
	var queue_id;

	// remove user from queue
	Queue.findOne({users : user._id}).exec()
		.then(queue => {
			if (!queue) { throw ('You have already confirmed this event!'); }
		    queue_id = queue._id;
			if (queue.users.length > 1) {}
			return Queue.remove({ _id: queue_id }).exec(); // remove queue
		})
	;

	User.findByIdAndUpdate(user._id, { event_status : 'Confirmed' }).exec();
	Events.findById(email_data.id).exec()
		.then((event) => {
			// remove corresponding queue from event
			if (!event) { throw ('No event found'); }
			current_event = event._id;
			event.queue.remove(queue_id);
			return event.save();
		})
		.then(() => {
			// find chat that corresponds to event, if none, create one
			return Chat.findOne({eventId: current_event });
		})
		.then(chat => {
			var message;
			if (!chat) {
				// create new chat
				message = new Message({
					user: user._id,
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
				   	user: user._id,
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
			email_data.first_name = user.first_name;
			email_data.event_link = url_origin + '/home/event/' + email_data.id;

			var text_version = EmailTemplate.get_text_version(email_data);
			var html_version = EmailTemplate.get_html_version(email_data);
			var email_content = {
				to: user.email,
				subject: '[5PM] ' + email_data.activity + ' at ' + email_data.venue,
				text: text_version,
				html: html_version
			};

			emailCtrl.sendEmail(email_content);
		})
		.then(()=>res.sendStatus(204))
		.catch(handleError(res))
	;
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

	return Queue.findOne({ users: user_id }).exec()
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

		var event_object_id = new mongoose.Types.ObjectId(event_id);
		var past_event = {
			event: event_object_id,
			status: enums.event_status.DECLINED.value
		};
		user.event_history.push(past_event);
		user.save();
	})
	.then(()=>res.sendStatus(204))
	.catch(handleError(res));
}

// leave event after accepting
export function leaveEvent(req, res) {
	var response = { status: 'ok' };
	var event_id = req.body.id;
	var token = req.cookies.token;
	var user_id = req.user._id;

	// User - change event_status = null
	// User - change current_event = null
	return Promise.resolve(User.findById(user_id).exec())
	.then((user)=> {
		user.event_status = null;
		user.current_event = null;
		var past_event = {
			event: new mongoose.Types.ObjectId(event_id),
			status: enums.event_status.LEFT.value
		};
		user.event_history.push(past_event);
		user.save();
	})
	.then(() => {
		// Event - remove user from event
		return Promise.resolve(Events.findById(event_id).exec());
	})
	.then(event => {
		event.users.remove(user_id);
		return event.save();
	})
	.then(() => {
		// send chat message
		var eventId = new mongoose.Types.ObjectId(event_id);
		return Promise.resolve(Chat.findOne({eventId: eventId}).exec());
	})
	.then(chat => {
		var current_user = new mongoose.Types.ObjectId(user_id);
		var leave_message = new Message({
			user: current_user,
			message: 'has left the event.',
			timestamp: new Date()
		});
		chat.messages.push(leave_message);
		chat.save();
	})
	.then(()=>res.sendStatus(204))
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
					adjectives: users[i].adjectives,
					status: users[i].event_status
				};
				confirmed_users.push(current_user);
				continue;
			}

			if (users[i].event_status === 'Confirmed') {
				current_user = {
					name: users[i].first_name + ' ' + users[i].last_name,
					profile_picture: users[i].profile_picture.current,
					adjectives: users[i].adjectives
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

export function endEvent(req, res) {
	var event_id = req.params.id;
	var fetched_event = {};
	Events.findById(event_id).populate([{path:'queue', select:'user status'}, {path:'users', select:'event_status current_event event_history'}])
		.then(ev => { // Update and end for attended users
			fetched_event = ev;
			var attendees = [];
			// Remove pending user confirmation users from event.users
			for (var i=ev.users.length -1; i>=0; i--){
				if (ev.users[i].event_status === 'Pending User Confirmation'){
					ev.users.splice(i, 1);
				}
				else { attendees.push(ev.users[i]._id); }
			}
			Events.findByIdAndUpdate(event_id,{ $set : { users : ev.users} }).exec();

			// Update confirmed users
			User.update({
				_id : {$in: attendees}
			}, {
				$set : {
					event_status : null,
					current_event : null
				},
				$push : {
					event_history : event_id
				}
			}, {
				multi: true
			}).exec();

			return ev;
		})
		.then(ev => { // Remove pending confirm users from queue. This could be written without the for loop
			if (ev.queue && ev.queue.length > 0) {
				for (var j = 0; j < ev.queue.length; j++) {
					if (ev.queue[j].status === 'Pending User Confirmation')
					{
						User.findByIdAndUpdate(ev.queue[j].user, {
							$set : {
								event_status : null,
								current_event : null
							}
						}).exec();

						Queue.remove(ev.queue[j]).exec();
					}
				}
			}

			return Events.findByIdAndUpdate(event_id, {
				$set:{
					queue : null,
					status : 'Ended'
				}
			});
		})
		.then(()=>{res.sendStatus(200); })
	;
}
