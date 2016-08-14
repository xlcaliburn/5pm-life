(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('CreateVenueModalController', CreateVenueModalController);

	function CreateVenueModalController ($uibModalInstance, Venues, Activities) {
		var vm = this;
		vm.submit = submit;

		function submit() {
			Venues.create(vm.form_data)
				.success(function(data) {
					console.log(data);
					$uibModalInstance.close(data);
				});
		}
	}

})();