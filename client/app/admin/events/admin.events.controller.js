'use strict';

(function() {
	angular
		.module('fivepmApp.admin')
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, Events) {
		var vm = this;
		vm.createFormData = {};
		vm.createEvent = createEvent;

		getEvents();

		function getEvents() {
			Events.get()
				.success(function(data) {
					$scope.events = data;
					console.log(data);
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