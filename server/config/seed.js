/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Enums from '../api/enums/enums.model';
import Queue from '../api/queue/queue.model';

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

Queue.find({}).remove()
	.then(() => {
		Queue.create({
			user : "57af88c2e71a6cd05cad91cc",
			status : 1
		}, {
			user : "57af88c2e71a6cd05cad91cc",
			status : 1			
		})
		.then(() => {
			console.log('Finished populating queue');
		});
	});

Enums.find({}).remove()
	.then(() => {
		Enums.create({
			type : 'activity_tag',
			key : 'Active',
			value : 0
		}, {
			type : 'activity_tag',
			key : 'Social',
			value : 1
		}, {
			type : 'queue_status',
			key : 'Searching',
			value : 0
		}, {
			type : 'queue_status',
			key : 'Pending Confirm',
			value : 1,
		})
		.then(() => {
			console.log('Finished populating enums');
		});
	});