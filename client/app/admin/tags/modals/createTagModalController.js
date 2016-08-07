(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('CreateTagModalController', CreateTagModalController);

	function CreateTagModalController ($uibModalInstance, Enums, tagType) {
		var vm = this;
		vm.title = null;
		vm.tagType = tagType;
		vm.createFormData = {};
		vm.createType = null;
		vm.enum_name = null;
		vm.submit = submit;

		init();

		function init() {
			if (vm.tagType === "activity")
			{
				vm.title = "Activity";
			}
			else if (vm.tagType === "tag")
			{
				vm.title = "Event Tag";
			}
		}

		function submit() {
			vm.createFormData.enum_type = vm.tagType;
			vm.createFormData.enum_name = vm.enum_name;

			Enums.create(vm.createFormData)
				.success(function(data) {
					vm.createFormData = {};
					$uibModalInstance.close(data);					
				});

			$uibModalInstance.close();
		}
	}
})();