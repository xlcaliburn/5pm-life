(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('CreateNewEventModalController', CreateNewEventModalController);

	function CreateNewEventModalController ($uibModalInstance, Events) {
		var vm = this;
		vm.submit = submit;
		vm.createFormData = {};

		function submit() {
			createEvent();
		}

		function createEvent() {
			vm.createFormData.dt_search_start = new Date().getTime();
			Events.create(vm.createFormData)
				.success(function(data) {
					vm.createFormData = {};
					$uibModalInstance.close(data);
				});
		}
	}

})();