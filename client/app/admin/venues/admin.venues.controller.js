(function () {
	'use strict';

	angular.module('fivepmApp.admin')
		.controller('AdminVenuesController', AdminVenuesController);

	function AdminVenuesController ($scope, $http, Venues, Enums) {
		var vm = this;
		vm.venues = {};
		vm.createVenue = createVenue;
		vm.deleteVenue = deleteVenue;
		vm.formData = {};
		vm.validTags = [];
		var newTags;

		Enums.getTags()
			.success(function(data) {
				for(var tag in data) {
					vm.validTags.push(data[tag].enum_name);
				}
				newTags = $('#venue_tags').tags({
					suggestions: vm.validTags,
					restrictTo: vm.validTags,
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
			console.log(vm.formData); 
			if (!$.isEmptyObject(vm.formData)) {
				vm.formData.tags = newTags.getTags();
				Venues.create(vm.formData)
					.success(function(data) {
						vm.formData = {};
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