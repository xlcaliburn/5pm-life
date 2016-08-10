(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($stateParams, $timeout, Events, Venues, Activities, Users) {
		var vm = this;
		vm.selectedEvent = {};
		vm.allowedActivities = {};
		vm.allowedVenues = {};
		vm.delete_event = deleteEvent;

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
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});	

			Events.getById($stateParams.event_id)
				.success(function(data) {
					vm.selectedEvent = data[0];
					console.log(vm.selectedEvent);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});				
		}

		function submit() {
			
		}

		function deleteEvent(id) {
			Events.delete(id)
				.success(function(data) {

				});
		}		

	}

})();