(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($scope, $q, $state, $uibModal, $stateParams, $timeout, Queue, Events, Venues, Activities, Users) {
		var vm = this;
		vm.selected_event = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.delete_event = deleteEvent;
		vm.add_users = addUsersModal;
		vm.submit = submit;
		vm.queue = {};
		vm.event_id = $stateParams.event_id;
		vm.remove_user_from_event = removeUserFromEvent;

		vm.users_to_add = [];

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
				})
				.error(function(data) {
					console.log('Error: ' + data);
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
				for (var queue_id in data)
				{
					if (data[queue_id] && vm.users_to_add.indexOf(queue_id) === -1)
					{
						vm.users_to_add.push(queue_id);
					}
				}

				// vm.selected_event.user_queue = data.user_queue;
			}, function () {});
		}

		function updateQueueStatus() {
			// TODO
		}

		function notifyUsers() {
			// TODO
		}

		function removeUserFromEvent(id) {
			vm.users_to_add.splice(vm.users_to_add.indexOf(id), 1);

			// for(var i = 0; i<vm.selected_event.user_queue.length; i++)
			// {
			// 	if (vm.selected_event.user_queue[i]._id === id) {
			// 		vm.selected_event.user_queue.splice(i,1);
					
			// 		console.log(vm.selected_event._id);
			// 		Events.put(vm.selected_event._id, vm.selected_event)
			// 			.success(function(data) {console.log(data);})
			// 		break;
			// 	}
			// }
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
			 	// Update queue status from 1 to 2
				updateQueueStatus();
				notifyUsers();

				vm.selected_event.status = 'Active';
			}

			Events.put(vm.selected_event._id, vm.selected_event)
				.success(function() {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event saved', 2000);
				});			
		}		
	}
})();