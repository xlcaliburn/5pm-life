(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($timeout, $uibModalInstance, Events, Venues, Activities) {
		var vm = this;
		vm.submit = submit;
		vm.selectedEvent = {};
		vm.allowedActivities = {};
		vm.allowedVenues = {};
		vm.title = 'Create Event';

		init();

		function init() {
			$timeout(function() {
				materialize_select();
			});

			Venues.get()
				.success(function(data) {
					vm.allowedVenues = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Activities.get()
				.success(function(data) {
					vm.allowedActivities = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});	

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