(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventModalController', EditEventModalController);

	function EditEventModalController ($uibModalInstance, Events) {
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
	}

})();