(function () {
	'use strict';
	
	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, $interval, $uibModal, Events) {
		var vm = this;
		vm.getEvents = getEvents;
		vm.events = {};
		vm.createFormData = {};
		vm.currentTime = new Date(Date.now()).getTime();
		vm.openModal = openModal;

		init();

		function init() {
			getEvents();

			var tick = function() {
				vm.currentTime = new Date(Date.now()).getTime();
			};
			$interval(tick, 1000);		
		}

		function eventModal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/eventModal.html',
				controller: 'EventModalController',
				controllerAs:'vm', 
				size: 'lg',
				resolve: {}
			});

			modalInstance.result.then(function(data) {
				vm.events = updateTime(data);
			}, function () {});
		}


		function getEvents() {
			Events.get()
				.success(function(data) {
					vm.events = updateTime(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function openModal(id) {
			if (id) {
				Events.getEvent(id)
					.success(function(data) {
						eventModal(data[0]);
					});
			}
			else {
				eventModal();
			}
		}

		function updateTime(data) {
			$.each(data, function(index, event) {
				if (event.dt_search_start) {
					event.dt_search_start_time = new Date(event.dt_search_start).getTime();
				}
			});

			return data;
		}
	}
})();