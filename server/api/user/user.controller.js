'use strict';

import _ from 'lodash';
import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
	statusCode = statusCode || 422;
	return function(err) {
		res.status(statusCode).json(err);
	};
}

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

export function getDecodedToken(token) {
	if (!token) {
		return false;
	}
	return jwt.verify(token, config.secrets.session);
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
	return User.find({}, '-salt -password').exec()
		.then(users => {
			return res.status(200).json(users);
		})
		.catch(handleError(res));
}

/**
 * Get users by id
 */
export function getUsersById(req, res) {
	return User.find({_id : req.body.users}).exec()
		.then(users => {
			return res.status(200).json(users);
		})
		.catch(handleError(res));
}


/**
 * Creates a new user
 */
export function create(req, res, next) {
	var newUser = new User(req.body);

	newUser.provider = 'local';
	newUser.role = 'user';
	newUser.save()
		.then(function(user) {
			var token = jwt.sign({ _id: user._id }, config.secrets.session, {
				expiresIn: 60 * 60 * 5
			});
			res.json({ token });
		})
		.catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
	var userId = req.params.id;

	return User.findById(userId).exec()
		.then(user => {
			return res.status(200).json(user);
		})
		.catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
	return User.findByIdAndRemove(req.params.id).exec()
		.then(function() {
			res.status(204).end();
		})
		.catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	return User.findById(userId).exec()
		.then(user => {
			if (user.authenticate(oldPass)) {
				user.password = newPass;
				return user.save()
					.then(() => {
						res.status(204).end();
					})
					.catch(validationError(res));
			} else {
				return res.status(403).end();
			}
		});
}

function saveUpdates(updates) {

	return function(entity) {
		var updated = _.merge(entity, updates);
		return updated.save({new : true})
			.then(updated => {
				return updated;
			});
	};
}

export function updateById(req, res, next) {
	if (req.body._id) {
		delete req.body._id;
	}
	return User.findById(req.params.id)
		.exec()
		.then(saveUpdates(req.body))
		.then(function(){return res.status(204).end();})
		.catch(handleError(res));
}

// get user verification for signup
export function getUserVerification(req, res) {
	var token = req.cookies.token;
	if (!token) { throw 'unauthorized'; }
	var user_id = getDecodedToken(token)._id;

	return User.findById(user_id).exec()
	.then((user) => {
		if (user.verified) {
			return res.send(true);
		} else {
			return res.send(false);
		}
	}).catch(handleError(res));
}

/**
 * Get my info
 */
export function me(req, res, next) {
	var userId = req.user._id;

	return User.findOne({ _id: userId }, '-salt -password').exec()
		.then(user => { // don't ever give out the password or salt
			if (!user) {
				return res.status(401).end();
			}
			return res.json(user);
		})
		.catch(err => next(err));
}

// get settings info
export function getUserSettings(req, res, next) {
	var token = req.params.token;
	var response = {};
	if (!token) {
		response.status = 'unauthorized';
		return res.json({ response: response });
	}
	var decoded_token = jwt.verify(token, config.secrets.session);

	return User.findOne({ _id: decoded_token._id }, '-_id first_name last_name ethnicity gender birthday email profile_picture.current').exec()
		.then(function(user) {
			if (!user) {
				response.status = 'unauthorized';
				return res.json({ response: response });
			}
			response.status = 'ok';
			response.user = user;
			return res.json({ response: response });
		})
		.catch(function(err) {
			response.status = 'error';
			response.error = err;
			return res.json({ response: response });
		});
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
	res.redirect('/');
}
