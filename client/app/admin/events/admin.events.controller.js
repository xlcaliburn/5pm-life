(function() {
	'use strict';

	angular
		.module('fivepmApp.admin', [])
		.controller('AdminEventsController', AdminEventsController);

	function AdminEventsController ($scope, $http, Events) {
		var vm = this;
		vm.createFormData = {};

		vm.createEvent = function() {
			console.log("creating");
			if (!$.isEmptyObject(vm.createFormData)) {
				Event.create(vm.createFormData)
					.success(function(data) {
						vm.createFormData = {};
					});
			}
		};
	}
})();