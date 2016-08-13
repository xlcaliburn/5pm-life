(function() {
	'use strict';

	angular.module('apiService', [])
		.factory('Users', function($http) {
			return {
				get : function() {
					return $http.get('/api/users');
				},
				getUsersById : function(users) {
					return $http.get('/api/users');
				},
				create : function(data) {
					return $http.post('/api/users', data);
				}
			};
		})
		.factory('Queue', function($http) {
			return {
				get : function() {
					return $http.get('/api/queue');
				},
				put : function(data) {
					return $http.put('/api/queue', data);
				},
				create : function(data) {
					return $http.post('/api/queue', data);
				},
				updateQueueStatus : function (id, status) {
					
				}
			};
		})
		.factory('Activities', function($http) {
			return {
				get : function() {
					return $http.get('/api/activities');
				},
				create : function(data) {
					return $http.post('/api/activities', data);
				},
				delete : function(id) {
					return $http.delete('/api/activities/' + id);
				}
			};
		})		
		.factory('Venues', function($http) {
			return {
				get : function() {
					return $http.get('/api/venues');
				},
				create : function(data) {
					return $http.post('/api/venues', data);
				},
				delete : function(id) {
					return $http.delete('/api/venues/' + id);
				}
			};
		})
		.factory('Enums', function($http) {
			return {
				get : function() {
					return $http.get('/api/enums');
				},
				getByType : function(type) {
					return $http.get('/api/enums/' + type);
				},
				create : function(data) {
					return $http.post('/api/enums', data);
				},
				delete : function(id) {
					return $http.delete('/api/enums/' + id);
				}
			};
		})
		.factory('Events', function($http) {
			return {
				get : function() {
					return $http.get('/api/events');
				},
				getById : function(id) {
					return $http.get('/api/events/' + id);
				},
				put : function(data) {
					return $http.put('/api/events/' + data._id, data);
				},
				create : function(data) {
					return $http.post('/api/events', data);
				},
				delete : function(id) {
					return $http.delete('/api/events/' + id);
				}
			};
		})		
		.factory('AdminSettings', function($http) {
			return {
				get : function() {
					return $http.get('/api/admin');
				},
				create : function(data) {
					return $http.post('/api/admin', data);
				}
			};
		});
})();