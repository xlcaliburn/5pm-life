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
			status : 'Pending',
			search_parameters : {
				override_default : false,
				tags : []
			}
		}, {
			user : "57b675bfb921140c3ab275c4",
			status : 'Pending',
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
			value : 'Active'
		}, {
			type : 'activity_tag',
			key : 'SOCIAL',
			value : 'Social'
		}, {
			type : 'queue_status',
			key : 'SEARCHING',
			value : 'Searching'
		}, {
			type : 'queue_status',
			key : 'PENDING',
			value : 'Pending'
		}, {
			type : 'queue_status',
			key : 'PENDING_USER_CONFIRM',
			value : 'Pending User Confirmation',
		}, {
			type : 'ethnicity',
			key : 'CAUCASIAN',
			value : 'Caucasian'
		}, {
			type : 'ethnicity',
			key : 'LATINO',
			value : 'Latino/Hispanic'
		}, {
			type : 'ethnicity',
			key : 'AFRICAN',
			value : 'African'
		}, {
			type : 'ethnicity',
			key : 'CARIBBEAN',
			value : 'Caribbean'
		}, {
			type : 'ethnicity',
			key : 'SOUTH_ASIAN',
			value :  'South Asian'
		}, {
			type : 'ethnicity',
			key : 'EAST_ASIAN',
			value : 'East Asian'
		}, {
			type : 'ethnicity',
			key : 'MIXED',
			value : 'Mixed'
		}, {
			type : 'ethnicity',
			key : 'OTHER',
			value : 'Other'
		}, {
			type : 'location',
			key : 'CA_ON_RICHMOND_HILL',
			value : 'Richmond Hill'
		})
		.then(() => {
			console.log('Finished populating enums');
		});
	});
