(function () {
	'use strict';

	angular.module('fivepmApp.admin')
		.controller('AdminVenuesController', AdminVenuesController);

	function AdminVenuesController ($scope, $http, $uibModal, Venues) {
		var vm = this;
		vm.venues = {};
		vm.delete_venue = deleteVenue;
		vm.create_modal = create_modal;

		init();

		function init() {
			Venues.get()
				.then(function(res) {
					vm.venues = res.data;
					console.log(vm.venues);
				})
				.catch((err)=>console.log('Error: ' + err))
			;
		}

		function deleteVenue(id) {
			Venues.delete(id)
				.then(()=>init())
			;
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

			modalInstance.result.then(()=>init());
		}
	}
})();
