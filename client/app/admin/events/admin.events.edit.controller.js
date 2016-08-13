(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($scope, $q, $state, $stateParams, $timeout, Queue, Events, Venues, Activities, Users) {
		var vm = this;
		vm.selectedEvent = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.delete_event = deleteEvent;
		vm.submit = submit;
		vm.queue = {};

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

			test();
		}

		function test() {
			Users.get()
				.success(function(data) {
					vm.queue = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				}); 
		}

		function submit() {
			Events.put(vm.selectedEvent)
				.success(function(data) {
					vm.selectedEvent = {};

					updateUserStatus();
					notifyUser();

					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event saved', 2000);
				});			
		}

		function updateUserStatus() {
			// for (var q in vm.queue)
			// {
			// 	Queue.updateQueueStatus(q._id, 2)
			// 		.success(function(data) {
			// 			vm.queue = data;
			// 		})
			// 		.error(function(data) {
			// 			console.log('Error: ' + data);
			// 		});
			// }
		}

		function notifyUser() {
			//todo
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