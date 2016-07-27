(function() {
	'use strict';

	angular
	.module('adminEventCtrl', [])
	.controller('AdminEventController', AdminEventController);

	function AdminEventController ($scope, $http, Events) {
		var vm = this;
		vm.createFormData = {};

		vm.createEvent = function() {
			if (!$.isEmptyObject(vm.createFormData)) {
				Event.create(vm.createFormData)
					.success(function(data) {
						vm.createFormData = {};
					});
			}
		};
	}
})();