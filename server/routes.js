/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {

	var mongoose = require('mongoose');
	var chatmodel = require('./api/chat/chat.model')(mongoose);

	app.use('/api/things', require('./api/thing')); // to delete
	app.use('/api/users', require('./api/user'));
	app.use('/api/email', require('./api/email')); // generic send email
	app.use('/api/signup', require('./api/signup')); // signup
	app.use('/api/signup/verify', require('./api/signup/verify')); // verify email
	app.use('/api/recovery', require('./api/recovery')); // verify reset password
	app.use('/api/resetpassword', require('./api/recovery/resetpassword')); // change password

	// upload images
	app.use('/api/upload/avatar', require('./api/upload'));

	app.use('/api/enums', require('./api/enums'));
	app.use('/api/activities', require('./api/activities'));
	app.use('/api/venues', require('./api/venues'));
	app.use('/api/adminsettings', require('./api/adminsettings'));
	app.use('/api/events', require('./api/events'));
	app.use('/api/queue', require('./api/queue'));
	app.use('/api/chat', require('./api/chat'));

	app.use('/auth', require('./auth').default);

	// All undefined asset or api routes should return a 404
	app.route('/:url(api|auth|components|app|bower_components|assets)/*')
	 .get(errors[404]);

	// All other routes should redirect to the index.html
	app.route('/*')
		.get((req, res) => {
			res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
		});
}
