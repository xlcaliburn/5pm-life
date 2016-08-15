/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {

	var mongoose = require('mongoose');
	var models = require('./api/model.js')(mongoose);

	// Insert routes below
	app.use('/api/things', require('./api/thing')); // to delete
	app.use('/api/users', require('./api/user'));
	app.use('/api/email', require('./api/email')); // generic send email
	app.use('/api/signup', require('./api/signup')); // signup
	app.use('/api/signup/verify', require('./api/signup/verify')); // verify email
	app.use('/api/recovery', require('./api/recovery')); // verify reset password
	app.use('/api/resetpassword', require('./api/recovery/resetpassword')); // change password

	// queue process routes
	app.use('/api/queue/process', require('./api/queue/process'));

	//app.use('/api/enums', require('./api/enums/enums.routes.js'));
	app.use('/api/enums', require('./api/enums'));
	app.use('/api/activities', require('./api/activities/activities.routes.js'));
	app.use('/api/venues', require('./api/venues/venues.routes.js'));
	app.use('/api/admin', require('./api/admin/admin.routes.js'));
	app.use('/api/events', require('./api/events'));
	app.use('/api/queue', require('./api/queue'));

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
