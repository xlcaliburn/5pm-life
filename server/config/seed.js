/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';

User.find({}).remove()
	.then(() => {
		User.create({
			provider: 'local',
			first_name: 'Test',
			last_name: 'User',
			email: 'test@example.com',
			password: 'test'
		}, {
			provider: 'local',
			role: 'admin',
			first_name: 'Admin',
			last_name: 'Admin',
			email: 'admin@example.com',
			password: 'admin'
		}, {
			provider: 'local',
			role: 'admin',
			first_name: 'Michael',
			last_name: 'Test',
			email: 'MichaelTest@example.com',
			password: 'admin'
		})
		.then(() => {
			console.log('Finished populating users');
		});
	});

// Enums.find({}).remove();
	// .then(() => {
	// 	Enums.create({
	// 		type : 'activity_tag',
	// 		key : 'Active',
	// 		value : 0
	// 	}, {
	// 		type : 'activity_tag',
	// 		key : 'Social',
	// 		value : 1
	// 	}, {
	// 		type : 'queue_status',
	// 		key : 'Inactive',
	// 		value : 0
	// 	}, {
	// 		type : 'queue_status',
	// 		key : 'Searching',
	// 		value : 1
	// 	}, {
	// 		type : 'queue_status',
	// 		key : 'Pending Confirm',
	// 		value : 2,
	// 	}, {
	// 		type : 'queue_status',
	// 		key : 'In Event',
	// 		value : 3
	// 	}, {
	// 		type : 'queue_status',
	// 		key : 'Cancelled',
	// 		value : 4
	// 	});
	// });