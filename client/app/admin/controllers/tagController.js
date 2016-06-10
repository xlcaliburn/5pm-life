angular.module('tagCtrl', [])
	.controller('tagController', function($scope, $http, Tags) {
		$scope.formData = {};

		Tags.get()
			.success(function(data) {
				$scope.Tags = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		$scope.createTag = function() {
			if (!$.isEmptyObject($scope.formData)) {
				Tags.create($scope.formData)
					.success(function(data) {
						$scope.formData = {};
						$scope.Tags = data;
					});
			}
		};

		$scope.deleteTag = function(id) {
			Tags.delete(id)
				.success(function(data) {
					$scope.Tags = data;
				});
		};
	});
