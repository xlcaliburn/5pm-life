(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('CreateNewEventModalController', CreateNewEventModalController);

	function CreateNewEventModalController ($uibModalInstance, Events) {
		var vm = this;
		vm.submit = submit;
		vm.createFormData = {};
		vm.create_activity = null;
		vm.create_venue = null;

		function submit() {
			if (vm.create_activity != null) {
				createEvent();
				$uibModalInstance.close();
			}
		}

		function createEvent() {
			vm.createFormData.dt_search_start = new Date().getTime();
			vm.createFormData.activity = vm.create_activity;
			vm.createFormData.venue = {};
			vm.createFormData.venue.venue_name = vm.create_venue;

			Events.create(vm.createFormData)
				.success(function(data) {
					vm.createFormData = {};
					$uibModalInstance.close(data);					
				});
		}
	}

})();