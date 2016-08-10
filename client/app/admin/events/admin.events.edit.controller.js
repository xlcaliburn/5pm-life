(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($q, $stateParams, $timeout, Events, Venues, Activities, Users) {
		var vm = this;
		vm.selectedEvent = {};
		vm.allowedActivities = {};
		vm.allowedVenues = {};
		vm.delete_event = deleteEvent;

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

			Events.getById($stateParams.event_id)
				.success(function(data) {
					vm.selectedEvent = data[0];
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
			
		}

		function deleteEvent(id) {
			Events.delete(id)
				.success(function(data) {

				});
		}		

	}

})();