(function () {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminEnumsController', AdminEnumsController);

	function AdminEnumsController ($scope, $http, $uibModal, Enums) {
		var vm = this;
		vm.selected_enum = {};
		vm.enums = {};
		vm.formData = {};
		vm.delete_enum = delete_enum;
		vm.create_modal = create_modal;

		init();

		function init() {
			Enums.get()
				.success(function(data) {
					vm.enums = data;
					materialize_select();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function delete_enum(id) {
			Enums.delete(id)
				.success(function() {
					vm.get();
				});
		}

		function create_modal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/tags/modals/createEnumModalController.html',
				controller: 'CreateEnumModalController',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {}
			});

			modalInstance.result.then(function() {
				get();
			}, function () {});			
		}
	}
})();