(function() {
	'use strict';

	angular.module('apiService', [])
		.factory('Users', function($http) {
			return {
				get : function() {
					return $http.get('/api/users');
				},
				create : function(data) {
					return $http.post('/api/users', data);
				}
			}
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
			}
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
			}
		})
		.factory('Tags', function($http) {
			return {
				get : function() {
					return $http.get('/api/tags');
				},
				create : function(data) {
					return $http.post('/api/tags', data);
				},
				delete : function(id) {
					return $http.delete('/api/tags/' + id);
				}
			}
		})
		.factory('Events', function($http) {
			return {
				get : function() {
					return $http.get('/api/events');
				},
				put : function(data) {
					return $http.put('/api/events', data);
				},
				create : function(data) {
					return $http.post('/api/events', data);
				},
				delete : function(id) {
					return $http.delete('/api/events/' + id);
				}
			}
		})		
		.factory('AdminSettings', function($http) {
			return {
				get : function() {
					return $http.get('/api/admin');
				},
				create : function(data) {
					return $http.post('/api/admin', data);
				}
			}
		})
})();