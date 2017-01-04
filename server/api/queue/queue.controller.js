'use strict';

import _ from 'lodash';
import Queue from './queue.model';
import User from '../user/user.model';
import Events from '../events/events.model';
import jwt from 'jsonwebtoken';
import config from '../../config/environment';
import mongoose from 'mongoose';
import enums from '../enums/enums.json';

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
		console.log('Error is', err);
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
	// check queue to see if user is in queue and return status
	return User.findOne({ _id: req.user._id }).exec()
	.then(user => {
		if (!user.event_status && !user.current_event) {
			res.json({ queue: -1 });
			throw new Error('Not in queue');
		}
		else if (user.event_status && !user.current_event){
			res.json({ queue: user.event_status });
			throw new Error('User is searching');
		}

		return Events.findOne({ _id: user.current_event }).exec()
		.then(event => {
			if (!event) {
				res.status(401).end();
				throw new Error('Unauthorized');
			}

			return res.json({
				queue: user.event_status,
				event: {
					link: event._id,
					activity: event.activity.activity_name,
					venue: event.venue.venue_name
				}
			});
		});
	})
	.catch(()=>handleError(res));
}


/*=====================================*/

/* Add to Queue
=====================================*/
// Validate queue data
function validateQueueData(queue_data) {
	var error = false;
	var start_date = new Date(queue_data.event_start);
	var end_date = new Date(queue_data.event_end);

	// check if start date is on a friday or saturday
	// if (start_date.getDay() < 5) {
	// 	error = {
	// 		stage: 1,
	// 		message: 'Please choose a Friday or Saturday.'
	// 	};
	// }

	// check if end date is on the same friday or saturday
	// if (start_date.getDay() !== end_date.getDay()) {
	// 	error = {
	// 		stage: 1,
	// 		message: 'Start date and end date has to be the same.'
	// 	};
	// }

	// check if the times are at least x amount of hours apart with start time < end time
	var hours_diff = Math.abs(end_date - start_date) / 36e5;
	if (hours_diff < 3) {
		error = {
			stage: 1,
			message: 'Your available time range needs to be at least 3 hours.'
		};
	}

	// check if activity type is in the list activity_tags enums
	var activity_exists = false;
	for (var type in enums.activity_tag) {
		if (queue_data.tags.indexOf(enums.activity_tag[type].value.toLowerCase()) > -1) {
			activity_exists = true;
		}
	}
	if (!activity_exists) {
		error = {
			stage: 2,
			message: 'Please select an activity type.'
		};
	}

	// check if location is in the list location enums
	var location_exists = false;
	for (var city in enums.location) {
		if (queue_data.city === enums.location[city].value) {
			location_exists = true;
		}
	}
	if (!location_exists) {
		error = {
			stage: 3,
			message: 'Please select your location preference.'
		};
	}
	return Queue.findOne({user: queue_data.user_id}).exec()
	.then(function(queue){
		if (queue) {
			error = {
				stage: null,
				message: 'You are already in queue!'
			};
		}
		return error;
	});
}

// Creates a new Queue in the DB
/* Queue object passed in looks like below
var queue = {
	event_start: Date,
	event_end: Date,
	tags: [],
	city: string
};
*/
export function create(req, res) {
	var error = false;
	var queue = req.body;
	var userid = req.user;
	if (typeof(queue.user_id) !== 'undefined')
	{
		userid = queue.user_id;
	}

	validateQueueData(queue)
	.then(function(result){
		// return an error when validations do not work
		error = result;
		if (error) {
			console.log(error);
			res.json({ error: error });
			throw new Error('Error while creating queue');
		}
		// create the queue after passing the validations
		var queue_object = {
			users: [userid],
			status: 'Searching',
			search_parameters: {
				tags: queue.tags,
				event_search_dt_start: queue.event_start,
				event_search_dt_end: queue.event_end,
				city: queue.city
			},
			queue_start_time: new Date()
		};

		return Queue.create(queue_object)
		.then(function(){
			return User.findById(userid);
		})
		.then(function(user){
			user.event_status = 'Pending';
			return user.save();
		})
		.then(function(){
			return res.json({ error: false });
		})
		.catch(()=>handleError(res));

	});
}
/*=====================================*/

/* Cancel user event search
=======================================*/

export function cancelEventSearch(req, res) {
	return Queue.findOneAndRemove({ users : req.user._id })
		.then(()=>User.findByIdAndUpdate(req.user._id, { $set : { event_status : null } } ))
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
		for (var u = 0; u < queue[q].users.length; u++) {
			users_array.push(queue[q].users[u]._id);
		}
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
