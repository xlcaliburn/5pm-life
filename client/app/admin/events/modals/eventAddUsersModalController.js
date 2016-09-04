(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventAddUsersModalController', EventAddUsersModalController);

	function EventAddUsersModalController ($uibModalInstance, $filter, Enums, Users, Queue, Events, eventId) {
		var vm = this;
		vm.event = {};
		vm.queues = {}; // Get all valid queues
		vm.submit = submit;
		vm.getAge = getAge;
		vm.selected_queue = []; // Get queues to add to event from html
		vm.queue_ids = [];
		vm.queue_user_ids = []; // Get users corresponding to selected ids
		vm.enum_status = [];

		init();

		function init() {
			Queue.getByStatus('Searching')
				.success(function(data) {
					console.log(data);
					vm.queues = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Events.getById(eventId)
				.success(function(data) {
					vm.event = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Enums.getByType('queue_status')
				.success(function(data) {
					vm.enum_status = data;
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
			$uibModalInstance.close(vm.selected_queue);
		}
	}

})();
