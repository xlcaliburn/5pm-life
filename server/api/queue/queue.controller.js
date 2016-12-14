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
		.populate('users', 'email first_name last_name role birthday gender')
		.exec()
		.then(respondWithResult(res))
		.catch(handleError(res));
}

// Gets a single Queue from the DB
export function show(req, res) {
	return Queue.findById(req.params.id)
		.populate('users', 'email first_name last_name role birthday gender')
		.exec()
		.then(handleEntityNotFound(res))
		.then(respondWithResult(res))
		.catch(handleError(res));
}

export function getByStatus(req, res) {
	return Queue.find({status : req.params.status})
		.populate('users', 'email first_name last_name role birthday gender')
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

	// TODO: check if start date is on a friday or saturday

	// TODO: check if end date is on the same friday or saturday

	// TODO: check if the times are at least x amount of hours apart with start time < end time

	// TODO: check if activity type is in the list activity_tags enums

	// TODO: check if location is in the list location enums

	response.status = 'ok';

	return Queue.findOne({user: queue_data.user_id})
	.then(function(queue){
		if(queue){
			response.status = 'A queue already exists for the user.';
		}
		return response;
	})
	.catch(()=>handleError(response));
}

// Creates a new Queue in the DB
export function create(req, res) {
	// extract user_id from token
	var token = req.body.token;
	if (!token) {
		return res.status(403).send('unauthorized');
	}

	var decoded_token = jwt.verify(token, config.secrets.session);

	var response = { status: 'ok'};
	var queue_data = req.body;
	queue_data.user_id = decoded_token._id;

	validateQueueData(queue_data)
	.then(function(result){
		// return an error when validations do not work
		if (result.status !== 'ok') {
			response.status = result.status;
			return res.json({ response: response });
		}

		// create the queue after passing the validations
		var queue_object = {
			users: req.body.users,
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
		.then(function(){
			return User.findById(decoded_token._id);
		})
		.then(function(user){
			user.event_status = 'Pending';
			return user.save();
		})
		.then(function(){
			res.json({ response: response });
			return res;
		})
		.catch(()=>handleError(res));
	});
}
/*=====================================*/

/* Cancel user event search
=======================================*/

export function cancelEventSearch(req, res) {
	var token = getDecodedToken(req.params.token);
	return Queue.findOneAndRemove({ users : token._id })
		.then(()=>User.findByIdAndUpdate(token._id, { $set : { event_status : null } } ))
		.then(()=>res.sendStatus(200))
		.catch(()=>handleError(res))
	;
}

/*======================================*/
var io;
export default function(socketio) {
	io = socketio;
}

function saveUserEventStatus(user, event_id) {
	return User.update({
		_id: user._id
	}, {
		$set: {
			event_status: 'Pending User Confirmation',
			current_event: event_id
		}
	})
	.exec()
	.then(()=> {
		io.sockets.in(user._id).emit('update_status');
	});
}

// send confirmation email + add users to event
export function triggerEvent(req, res) {
	var response = {};
	var queue = req.body.queues;
	var event_id = req.body.event_id;
	var users_array = [];
	var queue_array = [];

	for (var q in queue) {
		queue_array.push(queue[q]._id);
		users_array.push(queue[q].user._id);
	}
	Queue.update({
			_id : { $in: queue }
	 	},{
			$set : { status : 'Pending User Confirmation' }
		},{
			multi : true
		}).exec()
		.then(()=> {
			return User.find({
				_id : { $in : users_array }
			});
		})
		.then(users=>{
			for (var k = 0; k < users.length; k++) {
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
	                subject: '[5PM] An event has been found!',
	                text: text_version,
	                html: html_version
	            };

	            emailCtrl.sendEmail(email_content);
				saveUserEventStatus(users[k], event_id);
			}
			return Events.findById(event_id);
		})
		.then(event=>{
			var event_users = event.users.concat(users_array);
			event_users = event_users.filter(function(item, pos) {
			    return event_users.indexOf(item) === pos;
			});

			return Events.findByIdAndUpdate({
				_id : event_id
			},{
				$set : { users : event_users }
			});
		})
		.then(respondWithResult(res))
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
