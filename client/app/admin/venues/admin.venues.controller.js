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

		Venues.get()
			.success(function(data) {
				vm.venues = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		function createVenue() {
			if (!$.isEmptyObject(vm.formData)) {
				
				Venues.create(vm.formData)
					.success(function(data) {
						vm.formData = {};
						vm.venues = data;
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