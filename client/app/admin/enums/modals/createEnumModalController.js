(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('CreateEnumModalController', CreateEnumModalController);

	function CreateEnumModalController ($uibModalInstance, Enums) {
		var vm = this;
		vm.enums = {};
		vm.tagType = tagType;
		vm.form_data = {};
		vm.createType = null;
		vm.enum_name = null;
		vm.submit = submit;

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
			vm.form_data.enum_type = vm.tagType;
			vm.form_data.enum_name = vm.enum_name;

			Enums.create(vm.form_data)
				.success(function(data) {
					vm.form_data = {};
					$uibModalInstance.close(data);					
				});

			$uibModalInstance.close();
		}
	}
})();