(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($scope, $q, $state, $uibModal, $stateParams, $timeout, Enums, Queue, Events, Venues, Activities) {
		var vm = this;
		vm.selected_event = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.delete_event = deleteEvent;
		vm.add_users = addUsersModal;
		vm.submit = submit;
		vm.queue = {};
		vm.event_id = $stateParams.event_id;
		vm.remove_queue_from_event = removeQueueFromEvent;

		vm.queues_to_add = [];
		vm.queues_to_remove = [];
		vm.enum_status = [];

		init();

		function init() {

			Venues.get()
				.then(function(res) {
					vm.allowed_venues = res.data;
					return Activities.get();
				})
				.then(function(res) {
					vm.allowed_activities = res.data;
					return res;
				})
				.then(function() {
					$timeout(function() {materialize_select();});
				})
				.catch(function(err) {
					console.log(err);
				});

			Events.getById(vm.event_id)
				.success(function(data) {
					vm.selected_event = data;
					vm.queues_to_add = vm.selected_event.queue;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});


			Enums.getByType('queue_status')
				.success(function(data) {
					vm.enum_status = data;
				});
		}

		function addUsersModal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/eventAddUsersModal.html',
				controller: 'EventAddUsersModalController',
				controllerAs:'vm', 
				size: 'lg',
				resolve: {
					eventId : function() { return vm.event_id; }
				}
			});

			modalInstance.result.then(function(data) {
				for (var queue_id in data) {
					if (data[queue_id] && vm.queues_to_add.indexOf(queue_id) === -1) {
						vm.queues_to_add.push(queue_id);
					}
				}
				
			}, function () {});
		}

		function updateQueueStatus(newStatus) {
			// TODO: Make this a single call
			for (var add_id in vm.queues_to_add) {
				Queue.put(vm.queues_to_add[add_id], {status : newStatus})
					// .then(function(res) { console.log(res); })
					.catch(function(err) { console.log(err); });
			}

			for (var remove_id in vm.queues_to_remove) {
				console.log(remove_id);
				console.log(vm.queues_to_remove);
				Queue.put(vm.queues_to_remove[remove_id], {status : vm.enum_status.SEARCHING})
					// .then(function(res) { console.log(res); })
					.catch(function(err) { console.log(err); });
			}

			vm.selected_event.queue = vm.queues_to_add;
		}

		function notifyUsers() {
			// TODO
		}

		function removeQueueFromEvent(id) {
			vm.queues_to_remove.push(id);
			vm.queues_to_add.splice(vm.queues_to_add.indexOf(id), 1);
		}

		function deleteEvent() {
			Events.delete(vm.selected_event._id)
				.success(function() {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event deleted', 2000);					
				});
		}

		function submit() {
			if (vm.selected_event.user_queue.length === vm.selected_event.allowed_capacity)
			{
			 	// TODO: Add warning 
			 	console.log('Event now set to active');

				updateQueueStatus(vm.enum_status.PENDING_USER_CONFIRM);
				notifyUsers();

				vm.selected_event.status = 'Active';
			}
			else
			{
				updateQueueStatus(vm.enum_status.PENDING);
			}

			Events.put(vm.selected_event._id, vm.selected_event)
				.success(function(data) {
					console.log(data);
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event saved', 2000);
				});
		}		
	}
})();