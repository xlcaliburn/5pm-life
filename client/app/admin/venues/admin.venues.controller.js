(function () {
	'use strict';

	angular.module('fivepmApp.admin')
		.controller('AdminVenuesController', AdminVenuesController);

	function AdminVenuesController ($scope, $http, Venues, Tags) {
		var vm = this;
		vm.venues = {};
		vm.createVenue = createVenue;
		vm.deleteVenue = deleteVenue;

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
				vm.venues = data;
				console.log(vm.venues);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		function createVenue() {
			if (!$.isEmptyObject($scope.formData)) {
				$scope.formData.tags = newTags.getTags();
				Venues.create($scope.formData)
					.success(function(data) {
						$scope.formData = {};
						vm.venues = data;
						
						var len = $('#venue_tags').tags().getTags().length;
						for(var i=0; i<len; i++){
							// console.log( $('#venue_tags').tags().getTags());
							$('#venue_tags').tags().removeLastTag();
						}
				});
			}
		}

		function deleteVenue(id) {
			Venues.delete(id)
				.success(function(data) {
					vm.venues = data;
				});
		}
	}
})();