(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventAddUsersModalController', EventAddUsersModalController);

	function EventAddUsersModalController ($uibModalInstance, $filter, Users, Queue, Events, eventId) {
		var vm = this;
		vm.event = {}; 
		vm.queues = {}; // Get all valid queues
		vm.submit = submit;
		vm.getAge = getAge;
		vm.selected_queue = []; // Get queues to add to event from html
		vm.queue_ids = []; 
		vm.queue_user_ids = []; // Get users corresponding to selected ids

		init();

		function init() {
			Queue.getByStatus(0)
				.success(function(data) {
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
			// TODO: Make this a single api call
			
			for (var queue_id in vm.selected_queue)
			{
				vm.queue_ids.push(queue_id);
				
				// Get corresponding queues from original call
				var queue = $filter('filter')(vm.queues, function (d) {
					return d._id === vm.queue_ids[0];
				});
				
				vm.queue_user_ids.push({
					"user_id" : queue[0].user._id,
					"first_name" : queue[0].user.first_name,
					"last_name" : queue[0].user.last_name
				});
				
				queue[0].status = 1;
				Queue.put(queue[0]._id, queue[0])
					.success(function() {
						
					})
					.error(function(data) {
						console.log('Error: ' + data);
					})
			}

			// Combine with users existing users in the event
			vm.event.user_queue = vm.event.user_queue.concat(vm.queue_user_ids);
			Events.put(vm.event._id, vm.event)
				.success(function(data) {
					$uibModalInstance.close(data);
				});
			
		}
	}

})();