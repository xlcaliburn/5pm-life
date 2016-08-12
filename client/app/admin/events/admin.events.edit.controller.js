(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($scope, $q, $state, $stateParams, $timeout, Events, Venues, Activities, Users) {
		var vm = this;
		vm.selectedEvent = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.delete_event = deleteEvent;
		vm.submit = submit;
		vm.user_queue = {};

		init();

		function init() {

			Venues.get()
				.success(function(data) {
					vm.allowed_venues = data;
					$timeout(function() {materialize_select();});
					console.log(vm.allowed_venues);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Activities.get()
				.success(function(data) {
					vm.allowed_activities = data;
					$timeout(function() {materialize_select();});
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Events.getById($stateParams.event_id)
				.success(function(data) {
					vm.selectedEvent = data[0];
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Users.get()
				.success(function(data) {
					vm.user_queue = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});				
		}


		function submit() {
			
			Events.put(vm.selectedEvent)
				.success(function(data) {
					vm.selectedEvent = {};
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event saved', 2000);
				});			
		}

		function deleteEvent() {
			console.log(vm.selectedEvent._id);
			Events.delete(vm.selectedEvent._id)
				.success(function(data) {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event deleted', 2000);					
				});
		}		

	}

})();