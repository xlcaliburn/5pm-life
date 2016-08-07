(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventModalController', EditEventModalController);

	function EditEventModalController ($uibModalInstance, Events, selectedEvent) {
		var vm = this;
		vm.submit = submit;
		vm.selectedEvent = selectedEvent;

		function submit() {
			if (vm.selectedEvent.activity) {
				Events.put(vm.selectedEvent)
					.success(function(data) {
						$uibModalInstance.close(data);
					});
				$uibModalInstance.close();
			}
		}
	}

})();