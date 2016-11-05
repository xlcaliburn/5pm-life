(function () { 'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, $interval, $uibModal, Events) {
		var vm = this;
		vm.eventModal = eventModal;
		vm.createFormData = {};
		vm.currentTime = new Date(Date.now());
		vm.events = [];
		vm.includeEndedEvents = includeEndedEvents;
		vm.getReadableDuration = getReadableDuration;

		var includedEndedEvents = false;
		vm.showEndedEventsCheckBox = false;
		vm.eventListFilter = eventListFilter;

		init();

		function init() {
			Events.get()
				.then(function(res) {
					vm.events = res.data;
				})
				.catch(function(err) {console.log(err);});

			var tick = function() {
				vm.currentTime = new Date(Date.now());
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
				vm.events = data;
			}, function () {});
		}

		/* When the "Show Ended Events" checkbox is selected all the events
		are fetched from the database. We only need to do this once.*/
		function includeEndedEvents(){
			if (!includedEndedEvents){
				Events.getAll()
				.then((events) => {
					vm.events = events.data;
					includedEndedEvents = true;
				})
				.catch(function(err) {console.log(err);});
			}
		}

		function eventListFilter(event){
			return vm.showEndedEventsCheckBox || event.status !== 'Ended';
		}

		function getReadableDuration(fromTime,toTime){
			var duration = moment.duration(moment(fromTime).diff(toTime));
			var readableDuration = Math.floor(duration.asDays()) + 'd ';
			readableDuration += duration.hours() + 'h ' + duration.minutes() + 'm';
			return readableDuration;
		}
	}
})();
