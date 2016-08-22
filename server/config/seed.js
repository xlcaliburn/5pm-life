/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Enums from '../api/enums/enums.model';
import Queue from '../api/queue/queue.model';

// User.find({}).remove()
// 	.then(() => {
// 		User.create(
// 		{
// 			'first_name' : 'Michael',
// 			'last_name' : 'Wong',
// 			'ethnicity' : 'South East Asian',
// 			'gender' : 'Male',
// 			'email' : 'michaelchunkitwong@gmail.com',
// 			'password' : 'a',
// 			'verified' : true,
// 			'event_history' : [ ],
// 			'role' : 'admin',
// 			'__v' : 0
// 		},
// 		{
// 			"first_name" : "a",
// 			"last_name" : "bc",
// 			"ethnicity" : "South East Asian",
// 			"gender" : "Male",
// 			"email" : "admin@example.com",
// 			"password" : "admin",
// 			"verified" : true,
// 			"event_history" : [ ],
// 			"role" : "admin",
// 			"__v" : 0
// 		},
// 		{
// 			"first_name" : "a",
// 			"last_name" : "bc",
// 			"ethnicity" : "South East Asian",
// 			"gender" : "Male",
// 			"email" : "a@gmail.com",
// 			"password" : "a",
// 			"verified" : true,
// 			"event_history" : [ ],
// 			"role" : "user",
// 			"__v" : 0
// 		},
// 		{
// 			"first_name" : "asdf",
// 			"last_name" : "de",
// 			"ethnicity" : "South East Asian",
// 			"gender" : "Male",
// 			"email" : "b@gmail.com",
// 			"password" : "b",
// 			"verified" : true,
// 			"event_history" : [ ],
// 			"role" : "user",
// 			"__v" : 0
// 		})
// 		.then(() => {
// 			console.log('Finished populating users');
// 		});
// 	});

Queue.find({}).remove()
	.then(() => {
		Queue.create({
			user : "57b675bfb921140c3ab275c3",
			status : 0,
			search_parameters : {
				override_default : false,
				tags : []
			}
		}, {
			user : "57b675bfb921140c3ab275c4",
			status : 0,
			search_parameters : {
				override_default : false,
				tags : []
			}
		});
	});

Enums.find({}).remove()
	.then(() => {
		Enums.create({
			type : 'activity_tag',
			key : 'ACTIVE',
			value : 0
		}, {
			type : 'activity_tag',
			key : 'SOCIAL',
			value : 1
		}, {
			type : 'queue_status',
			key : 'SEARCHING',
			value : 0
		}, {
			type : 'queue_status',
			key : 'PENDING',
			value : 1,
		}, {
			type : 'queue_status',
			key : 'PENDING_USER_CONFIRM',
			value : 2,
		}, {
			type : 'ethnicity',
			name : 'Caucasian',
			key : 'CAUCASIAN',
			value : 0
		}, {
			type : 'ethnicity',
			name : 'Latino/Hispanic',
			key : 'LATINO',
			value : 1
		}, {
			type : 'ethnicity',
			name : 'African',
			key : 'AFRICAN',
			value : 2
		}, {
			type : 'ethnicity',
			name : 'Caribbean',
			key : 'CARIBBEAN',
			value : 3
		}, {
			type : 'ethnicity',
			name : 'South Asian',
			key : 'SOUTH_ASIAN',
			value : 4
		}, {
			type : 'ethnicity',
			name : 'East Asian',
			key : 'EAST_ASIAN',
			value : 5
		}, {
			type : 'ethnicity',
			name : 'Mixed',
			key : 'MIXED',
			value : 6
		}, {
			type : 'ethnicity',
			name : 'Other',
			key : 'OTHER',
			value : 7
		}, {
			type : 'location',
			name : 'Richmond Hill',
			key : 'CA_ON_RICHMOND_HILL',
			value : 0
		})
		.then(() => {
			console.log('Finished populating enums');
		});
	});