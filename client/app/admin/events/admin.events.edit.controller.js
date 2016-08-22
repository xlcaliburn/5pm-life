(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($scope, $q, $state, $uibModal, $stateParams, $timeout, Queue, Events, Venues, Activities, Users) {
		var vm = this;
		vm.selectedEvent = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.delete_event = deleteEvent;
		vm.add_users = addUsersModal;
		vm.submit = submit;
		vm.queue = {};
		vm.event_id = $stateParams.event_id;
		vm.remove_user_from_event = removeUserFromEvent;

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
					vm.selectedEvent = data;
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
				vm.selectedEvent.user_queue = data.user_queue;
			}, function () {});
		}

		function updateQueueStatus() {
			// TODO
		}

		function notifyUsers() {
			// TODO
		}

		function removeUserFromEvent(id) {
			for(var i = 0; i<vm.selectedEvent.user_queue.length; i++)
			{
				if (vm.selectedEvent.user_queue[i]._id === id) {
					vm.selectedEvent.user_queue.splice(i,1);
					
					console.log(vm.selectedEvent._id);
					Events.put(vm.selectedEvent._id, vm.selectedEvent)
						.success(function(data) {console.log(data);})
					break;
				}
			}
		}

		function deleteEvent() {
			Events.delete(vm.selectedEvent._id)
				.success(function() {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event deleted', 2000);					
				});
		}

		function submit() {
			if (vm.selectedEvent.user_queue.length === vm.selectedEvent.allowed_capacity)
			{
			 	// Update queue status from 1 to 2
				updateQueueStatus();
				notifyUsers();

				vm.selectedEvent.status = 'Active';
			}

			Events.put(vm.selectedEvent._id, vm.selectedEvent)
				.success(function() {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event saved', 2000);
				});			
		}		
	}
})();