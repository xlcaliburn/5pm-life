'use strict';

import _ from 'lodash';

var mongoose = require('mongoose');
import Feedback from './feedback.model';

var EmailTemplate = require('../email/templates/email.global');
var emailCtrl = require('../email/email.controller');

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log('Error is', err);
		res.status(statusCode).send(err);
	};
}

// store feedback + send us an email
export function save(req, res) {
	// save in database
	var feedback = new Feedback({
		user: req.user._id,
		type: req.body.type,
		description: req.body.description,
		date_created: new Date()
	});

	return Feedback.create(feedback)
	.then(() => {
		// submit email to us
		var text_version = 'From ' + req.user.email + ':\r\n\r\n' + req.body.description;
		var html_version = text_version.replace(/(?:\r\n|\r|\n)/g,'<br>');

		var email_content = {
			to: 'fivepm.life@gmail.com',
			subject: '[Feedback - ' + req.body.type + '] From ',
			text: text_version,
			html: html_version
		};

		emailCtrl.sendEmail(email_content);
	})
	.then(() => {
		return res.json({ success: true });
	})
	.catch(handleError(res));

}

// get entire list of feedback
export function fetch(req, res) {
	return Feedback.find({}).populate('user', '_id first_name last_name email gender').exec()
	.then((feedback_json) => {
		return res.json(feedback_json);
	})
	.catch(handleError(res));
}
