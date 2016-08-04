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
		vm.editModal = editModal;

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

			modalInstance.result.then(function() {
				vm.getEvents();
			}, function () {});
		};


		function editModal(id) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/editEventModal.html',
				controller: 'EditEventModalController',
				controllerAs:'vm', 
				size: 'lg',
				resolve: {
				}
			});
		};

		function init() {
			getEvents();

			var tick = function() {
				vm.currentTime = new Date(Date.now()).getTime();
			}
			$interval(tick, 1000);
		}


		function getEvents() {
			Events.get()
				.success(function(data) {
					$.each(data, function(index, event) {
						if (event.dt_search_start) {
							event.dt_search_start_time = new Date(event.dt_search_start).getTime();
						}
					})
					vm.events = data;
					console.log(vm.events);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				})
		}

		function deleteEvent(id) {
			Events.delete(id)
				.success(function(data) {
					getEvents();
				});
		}


	}
})();