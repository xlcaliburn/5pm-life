(function () { 'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, $interval, $uibModal, Events) {
		var vm = this;
		vm.eventModal = eventModal;
		vm.createFormData = {};
		vm.currentTime = new Date(Date.now()).getTime();
		vm.events = [];
		vm.includeEndedEvents = includeEndedEvents;

		var includedEndedEvents = false;
		vm.showEndedEventsCheckBox = false;
		vm.eventListFilter = function(event){
			return vm.showEndedEventsCheckBox || event.status !== 'Ended';
		};

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
				vm.events.unshift(data);
				vm.events = updateTime(vm.events);
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

		/* When the "Show Ended Events" checkbox is selected all the events
		are fetched from the database. We only need to do this once.*/
		function includeEndedEvents(){
			if (!includedEndedEvents){
				Events.getAll()
				.then((events) => {
					vm.events = updateTime(events.data);
					includedEndedEvents = true;
				})
				.catch(function(err) {console.log(err);});
			}
		}
	}
})();
