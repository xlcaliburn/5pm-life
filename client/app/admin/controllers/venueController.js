angular.module('venueCtrl', [])
	.controller('venueController', function($scope, $http, Venues) {
		$scope.formData = {};

        var newTags = $('#venue_tags').tags({
            tagData:["boilerplate", "tags"],
            suggestions:["basic", "suggestions"],
            restrictTo:["basic"]
        });

		Venues.get()
			.success(function(data) {
				$scope.venues = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		$scope.createVenue = function() {
			if (!$.isEmptyObject($scope.formData)) {
				$scope.formData.tags = newTags.getTags();
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