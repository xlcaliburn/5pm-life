(function () {
	'use strict';
	
	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, $interval, $uibModal, Events) {
		var vm = this;
		vm.getEvents = getEvents;
		vm.deleteEvent = deleteEvent;
		vm.events = {};
		vm.createFormData = {};
		vm.currentTime = new Date(Date.now()).getTime();
		vm.createModal = createModal;
		vm.editEvent = editEvent;

		init();

		function createModal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/createNewEventModal.html',
				controller: 'CreateNewEventModalController',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {}
			});

			modalInstance.result.then(function(data) {
				vm.events = data;
			}, function () {});
		}

		function editModal(selectedEvent) {

			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/editEventModal.html',
				controller: 'EditEventModalController',
				controllerAs:'vm', 
				size: 'lg',
				resolve: {
					selectedEvent: function () { return selectedEvent; }
				}
			});

			modalInstance.result.then(function(data) {
				vm.events = data;
			}, function () {});
		}

		function init() {
			getEvents();

			var tick = function() {
				vm.currentTime = new Date(Date.now()).getTime();
			};
			$interval(tick, 1000);
		}

		function getEvents() {
			Events.get()
				.success(function(data) {
					$.each(data, function(index, event) {
						if (event.dt_search_start) {
							event.dt_search_start_time = new Date(event.dt_search_start).getTime();
						}
					});
					vm.events = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function editEvent(id) {
			Events.get(id)
				.success(function(data) {
					editModal(data[0]);
				});
		}

		function deleteEvent(id) {
			Events.delete(id)
				.success(function(data) {
					vm.events = data;
				});
		}
	}
})();