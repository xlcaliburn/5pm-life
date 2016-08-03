'use strict';

(function() {
	angular
		.module('fivepmApp.admin')
		.controller('AdminUsersController', AdminUsersController);

	function AdminUsersController($scope, $http, Users) {
		$scope.formData = {};

		Users.get()
			.success(function(data) {
				$scope.Users = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		$scope.createUser = function() {
			if (!$.isEmptyObject($scope.formData)) {
				Users.create($scope.formData)
					.success(function(data) {
						$scope.formData = {};
						$scope.Users = data;
					})
				;
			}
		};
	}
})();