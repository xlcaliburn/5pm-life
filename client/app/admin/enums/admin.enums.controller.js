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
				.success(function(data) {
					vm.enums = data;
				});
		}

		function create_modal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/enums/modals/createEnumModal.html',
				controller: 'CreateEnumModalController',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {}
			});

			modalInstance.result.then(function(data) {
				vm.enums = data;
			}, function () {});			
		}
	}
})();