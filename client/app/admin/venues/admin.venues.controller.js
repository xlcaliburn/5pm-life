'use strict';

(function() {
	angular.module('fivepmApp.admin')
		.controller('AdminVenuesController', AdminVenuesController);

	function AdminVenuesController ($scope, $http, Venues, Tags) {
			$scope.formData = {};
			$scope.validTags = [];
			var newTags;

			Tags.get()
				.success(function(data) {
					for(var tag in data) {
						$scope.validTags.push(data[tag].enum_name);
					}
					newTags = $('#venue_tags').tags({
			            suggestions: $scope.validTags,
			            restrictTo: $scope.validTags,
			            suggestOnClick: true
			        });
				})
				.error(function(data) {
					console.log('Error: ' + data);
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
							
							var len = $('#venue_tags').tags().getTags().length;
							for(var i=0; i<len; i++){
								// console.log( $('#venue_tags').tags().getTags());
								$('#venue_tags').tags().removeLastTag();
							}
					});
				}
			};

			$scope.deleteVenue = function(id) {
				Venues.delete(id)
					.success(function(data) {
						$scope.venues = data;
					});
			};
		}
})();