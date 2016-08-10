(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($q, $timeout, $uibModalInstance, Events, Venues, Activities) {
		var vm = this;
		vm.submit = submit;
		vm.selectedEvent = {};
		vm.allowedActivities = {};
		vm.allowedVenues = {};
		vm.title = 'Create Event';

		init();

		function init() {

			Venues.get()
				.success(function(data) {
					vm.allowedVenues = data;
					init_materialize();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Activities.get()
				.success(function(data) {
					vm.allowedActivities = data;
					init_materialize();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function init_materialize() {
			$timeout(function() {materialize_select();});
		}

		function submit() {
			vm.selectedEvent.dt_search_start = new Date().getTime();
			Events.create(vm.selectedEvent)
				.success(function(data) {
					vm.selectedEvent = {};
					$uibModalInstance.close(data);
				});
		}
	}

})();