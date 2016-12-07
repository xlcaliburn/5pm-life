(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EditUserController', EditUserController);

	function EditUserController ($scope, $q, $state, $timeout, $uibModal, $stateParams, Users) {
		var vm = this;
		vm.user = null;
		vm.user_id = $stateParams.user_id;
		vm.delete_user = deleteUser;
		vm.allowed_roles = ['admin', 'user'];
		vm.submit = submit;
		vm.unqueue = unqueue;

		init();

		function init() {
			Users.getById(vm.user_id)
				.then(function(res) {
					vm.user = res.data;
					vm.user.birthday = moment(vm.user.birthday).utc().format('MMMM DD, YYYY');
				})
				.then(function() {
					$timeout(function() {materialize_select();});
				})
				.catch(function(err) {console.log(err);});
		}

		function deleteUser() {
			console.log('delete');
		}

		function submit() {
			saveAndClose('User updated');
		}

		function unqueue() {
			Users.unQueueById(vm.user_id)
				.success(()=>{Materialize.toast("User Unqueued", 2000);});  // jshint ignore:line
		}

		function saveAndClose(notificationString) {
			Users.updateById(vm.user_id, vm.user)
				.success(function() {
					$state.go('admin.users', {}, { reload: true });
					Materialize.toast(notificationString, 2000); // jshint ignore:line
				});
		}

	}
})();
