(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('CreateEnumModalController', CreateEnumModalController);

	function CreateEnumModalController ($uibModalInstance, Enums) {
		var vm = this;
		vm.enums = {};
		vm.submit = submit;
		vm.form_data = {};

		init();

		function init() {
			Enums.get()
				.success(function(data) {
					vm.enums = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function submit() {
			vm.form_data.list = {};
			vm.form_data.list[vm.form_data.key] = vm.form_data.value;

			Enums.create(vm.form_data)
				.success(function(data) {
					vm.form_data = {};
					$uibModalInstance.close(data);					
				});

			$uibModalInstance.close();
		}
	}
})();