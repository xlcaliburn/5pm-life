(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($uibModalInstance, Events, selectedEvent) {
		var vm = this;
		vm.submit = submit;
		vm.selectedEvent = selectedEvent;


		function submit() {
			selectedEvent ? editEvent() : createEvent();
		}

		function editEvent() {
			if (vm.selectedEvent.activity) {
				Events.put(vm.selectedEvent)
					.success(function(data) {
						vm.selectedEvent = {};
						$uibModalInstance.close(data);
					});
			}			
		}

		function createEvent() {
			vm.selectedEvent.dt_search_start = new Date().getTime();
			Events.create(vm.selectedEvent)
				.success(function(data) {
					vm.selectedEvent = {};
					$uibModalInstance.close(data);
				});
		}		
	}

})();