"use strict";

angular.module('userCtrl', [])
	.controller('userController', function($scope, $http, Users) {
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
					});
			}
		};

		$scope.deleteUser = function(id) {
			Users.delete(id)
				.success(function(data) {
					$scope.Users = data;
				});
		};
	});
