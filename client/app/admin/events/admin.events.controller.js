'use strict';

(function() {
	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, $interval, $uibModal, Events) {
		var vm = this;
		vm.createFormData = {};
		vm.createEvent = createEvent;
		vm.events = {};
		vm.currentTime = new Date(Date.now()).getTime();

		init();

		vm.open = function (size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/createNewEventModal.html',
				// controller: '',
				size: size,
				resolve: {}
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

		function createEvent() {
			//if (!$.isEmptyObject(vm.createFormData)) {
				vm.createFormData.dt_search_start = new Date().getTime();
				Events.create(vm.createFormData)
					.success(function(data) {
						vm.createFormData = {};
						getEvents();
					});
			//}
		}

		function deleteEvent(id) {
			Events.delete(id)
				.success(function(data) {
					getEvents();
				});
		}		
	}
})();