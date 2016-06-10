angular.module('apiService', [])
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
;