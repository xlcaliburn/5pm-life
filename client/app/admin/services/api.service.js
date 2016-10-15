(function() { 'use strict';

	angular.module('ApiService', [])
		.factory('Users', function($http) {
			return {
				get : function() {
					return $http.get('/api/users');
				},
				create : function(data) {
					return $http.post('/api/users', data);
				},
				getMe : function() {
					return $http.get('/api/users/me');
				},
				getById : function(id) {
					return $http.get('/api/users/' + id);
				},
				updateById : function(id, data) {
					return $http.put('/api/users/' + id, data);
				}
			};
		})
		.factory('Queue', function($http) {
			return {
				get : function() {
					return $http.get('/api/queue');
				},
				getById : function(queue_id) {
					return $http.get('/api/queue/' + queue_id);
				},
				getByStatus : function(status) {
					return $http.get('/api/queue/status/' + status);
				},
				put : function(id, data) {
					return $http.put('/api/queue/' + id, data);
				},
				create : function(data) {
					return $http.post('/api/queue', data);
				},
				triggerEventStart: function(queue_data) {
					return $http.post('/api/queue/triggerEvent', queue_data);
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
				getByTypeNames : function (type) {
					return $http.get('/api/enums/name/' + type);
				},
				getByTypeAll : function(type) {
					return $http.get('/api/enums/all/' + type);
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
				getByIdAdmin : function(id) {
					return $http.get('/api/events/admin/' + id);
				},
				put : function(id, data) {
					return $http.put('/api/events/' + id, data);
				},
				updateUserQueue : function(id, users) {
					return $http.put('/api/events/users/'+id, users);
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
