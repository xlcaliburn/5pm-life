(function () { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('AdminUsersController', AdminUsersController);

	function AdminUsersController($scope, $http, Users) {
		var vm = this;
		vm.users = {};
		vm.form_data = {};
		vm.age = function(dob) { return moment().diff(dob, 'years'); };

		Users.get()
			.success(function(data) {
				vm.users = data;
				console.log(data);
			});
	}
})();
