angular.module('venueCtrl', [])
	.controller('venueController', function($scope, $http, Venues) {
		$scope.formData = {};

		Venues.get()
			.success(function(data) {
				$scope.venues = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		$scope.createVenue = function() {
			if (!$.isEmptyObject($scope.formData)) {
				Venues.create($scope.formData)
					.success(function(data) {
						$scope.formData = {};
						$scope.venues = data;
					});
			}
		};

		$scope.deleteVenue = function(id) {
			Venues.delete(id)
				.success(function(data) {
					$scope.venues = data;
				});
		};
	});