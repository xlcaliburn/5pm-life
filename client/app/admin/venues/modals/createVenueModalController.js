(function() { 'use strict';
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
				.then(function(res) {
					vm.valid_activities = res.data;
				})
			;
		}

		function submit() {
			var valid = [];
			for (var id in vm.form_data.valid_activities)
			{
				if(vm.form_data.valid_activities[id])
				{
					valid.push(id);
				}
			}
			vm.form_data.allowed_activities = valid;
			Venues.create(vm.form_data)
				.then(()=>$uibModalInstance.close());
		}
	}
})();
