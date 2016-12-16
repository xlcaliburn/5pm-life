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
				unqueueByUserId : function(id) {
					return $http.get('/api/users/' + id + '/unqueue');
				},
				getQueueByUserId : function(id) {
					return $http.get('/api/users/' + id + '/queue');
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
				},
				matchmake: function() {
					return $http.post('/api/queue/matchmake');
				}
			};
		})
		.factory('Activities', function($http) {
			return {
				get : function() {
					return $http.get('/api/activities');
				},
				getById : function(id) {
					return $http.get('/api/activities/' + id);
				},
				create : function(data) {
					return $http.post('/api/activities', data);
				},
				delete : function(id) {
					return $http.delete('/api/activities/' + id);
				},
				updateById : function(id, data) {
					return $http.put('/api/activities/' + id, data);
				}
			};
		})
		.factory('Venues', function($http) {
			return {
				get : function() {
					return $http.get('/api/venues');
				},
				getById : function(id) {
					return $http.get('/api/venues/' + id);
				},
				create : function(data) {
					return $http.post('/api/venues', data);
				},
				delete : function(id) {
					return $http.delete('/api/venues/' + id);
				},
				updateById : function(id, data) {
					return $http.put('/api/venues/' + id, data);
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
				}
			};
		})
		.factory('Events', function($http) {
			return {
				get : function() {
					return $http.get('/api/events');
				},
				getAll : function(){
					return $http.get('/api/events/all');
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
				end : function(id) {
					return $http.post('/api/events/end/' + id);
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
