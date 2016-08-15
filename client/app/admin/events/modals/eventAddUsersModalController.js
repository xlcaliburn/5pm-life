(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventAddUsersModalController', EventAddUsersModalController);

	function EventAddUsersModalController ($uibModalInstance, Users, Queue, Events, eventId) {
		var vm = this;
		vm.event = {}; 
		vm.queues = {}; // Get all valid queues
		vm.submit = submit;
		vm.getAge = getAge;
		vm.selected_queue = []; // Get queues to add to event

		init();

		function init() {
			Queue.get()
				.success(function(data) {
					vm.queues = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Events.get(eventId)
				.success(function(data) {
					vm.event = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function addUsersToEvent() {
			Queue.put(vm.selectedEvent)
				.success(function(data) {
					vm.selectedEvent = {};
					$uibModalInstance.close(data);
				});
		}

		function getAge(dateString) {
			var today = new Date();
			var birthDate = new Date(dateString);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			    age--;
			}
			return age;
		}

		function submit() {
			// Get selected queues and set status to 1

			// Pass list of queue ids back to admin.events.edit and close

			
		}
	}

})();