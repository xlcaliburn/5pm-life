(function () {
	'use strict';
	
	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, $interval, $uibModal, Events, Venues, Enums) {
		var vm = this;
		vm.getEvents = getEvents;
		vm.deleteEvent = deleteEvent;
		vm.events = {};
		vm.createFormData = {};
		vm.currentTime = new Date(Date.now()).getTime();
		vm.openModal = openModal;

		vm.allowedVenues = {};
		vm.allowedActivities = {};

		init();
		materialize_select();

		function eventModal(selectedEvent) {

			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/eventModal.html',
				controller: 'EventModalController',
				controllerAs:'vm', 
				size: 'lg',
				resolve: {
					selectedEvent: function () { return selectedEvent; },
					allowedVenues: function () { return vm.allowedVenues; },
					allowedActivities: function () { return vm.allowedActivities; }
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

			Venues.get()
				.success(function(data) {
					vm.allowedVenues = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Enums.getActivities()
				.success(function(data) {
					vm.allowedActivities = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});			
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

		function openModal(id) {
			Events.getEvent(id)
				.success(function(data) {
					eventModal(data[0]);
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