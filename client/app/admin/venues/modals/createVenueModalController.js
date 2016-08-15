(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('CreateVenueModalController', CreateVenueModalController);

	function CreateVenueModalController ($uibModalInstance, Venues, Activities) {
		var vm = this;
		vm.submit = submit;
		vm.form_data = {};
		vm.valid_activities = {};

		init();

		function init() {
			Activities.get()
				.success(function(data) {
					vm.valid_activities = data;
				})
		}

		function submit() {
			Venues.create(vm.form_data)
				.success(function(data) {
					$uibModalInstance.close(data);
				});
		}
	}

})();