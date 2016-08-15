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
		vm.user_queue = {};
		vm.submit = submit;
		vm.queue = {};
		vm.event_id = $stateParams.event_id;

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
				templateUrl: 'app/admin/events/modals/eventaddUsersModalModal.html',
				controller: 'EventaddUsersModalModalController',
				controllerAs:'vm', 
				size: 'lg',
				resolve: {
					eventId : function() { return vm.event_id; }
				}
			});

			modalInstance.result.then(function(data) {
				vm.user_queue = data;
			}, function () {});
		}

		function updateQueueStatus() {
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

		function notifyUsers() {
			//todo
		}

		function deleteEvent() {
			console.log(vm.selectedEvent._id);
			Events.delete(vm.selectedEvent._id)
				.success(function() {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event deleted', 2000);					
				});
		}

		function submit() {
			if (vm.selectedEvent.users.length === vm.selectedEvent.allowed_capacity)
			{
			 	// Update queue status from 1 to 2
				updateQueueStatus();
				notifyUsers();

				vm.selectedEvent.status = "Active";
			}
			
			Events.put(vm.selectedEvent._id, vm.selectedEvent)
				.success(function(data) {

					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event saved', 2000);
				});			
		}		
	}
})();