(function () { 'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, $interval, $uibModal, Events) {
		var vm = this;
		vm.eventModal = eventModal;
		vm.createFormData = {};
		vm.currentTime = new Date(Date.now()).getTime();
		vm.events = {};

		init();

		function init() {
			Events.get()
				.then(function(res) {
					vm.events = updateTime(res.data);
				})
				.catch(function(err) {console.log(err);});

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
