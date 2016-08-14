(function () {
	'use strict';

	angular.module('fivepmApp.admin')
		.controller('AdminVenuesController', AdminVenuesController);

	function AdminVenuesController ($scope, $http, $uibModal, Venues) {
		var vm = this;
		vm.venues = {};
		vm.delete_venue = deleteVenue;
		vm.create_modal = create_modal;

		Venues.get()
			.success(function(data) {
				vm.venues = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		function deleteVenue(id) {
			Venues.delete(id)
				.success(function(data) {
					vm.venues = data;
				});
		}

		function create_modal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/venues/modals/createVenueModal.html',
				controller: 'CreateVenueModalController',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {}
			});

			modalInstance.result.then(function(data) {
				vm.venues = data;
			});			
		}		
	}
})();