(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EditUserController', EditUserController);

	function EditUserController ($scope, $q, $state, $timeout, $uibModal, $stateParams, Users, Queue) {
		var vm = this;
		vm.user = null;
		vm.user_id = $stateParams.user_id;
		vm.facebook_url = null;
		vm.queue = null;
		vm.delete_user = deleteUser;
		vm.allowed_roles = ['admin', 'user'];
		vm.submit = submit;
		vm.create_queue = createQueue;
		vm.unqueue = unqueue;

		init();

		function init() {
			Users.getById(vm.user_id)
				.then(function(res) {
					vm.user = res.data;
					vm.user.birthday = moment(vm.user.birthday).utc().format('MMMM DD, YYYY');
					vm.facebook_url = 'http://www.facebook.com/' + vm.user.facebook.id;
					return res.data;
				})
				.then (function(user) {
					if (user.event_status !== null)
					{
						return Users.getQueueByUserId(user._id)
							.then(function(queue) {
								vm.queue = queue.data;
							})
						;
					}
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

		function createQueue() {
			if (vm.user.event_status !== null) { return; }
			console.log(vm.user_id);
			var queue_object = {
				user_id: vm.user_id,
				tags: ['social'],
				event_start: new Date(),
				event_end: new Date(),
				city: 'Toronto'
			};

			Queue.create(queue_object)
				.then(()=>{
					vm.user.event_status = 'Pending';
				});
		}

		function unqueue() {
			Users.unqueueByUserId(vm.user_id)
				.then(res=>{vm.user = res.data;})
				.then(()=>{Materialize.toast('User Unqueued', 2000);
			});
		}

		function saveAndClose(notificationString) {
			Users.updateById(vm.user_id, vm.user)
				.success(function() {
					$state.go('admin.users', {}, { reload: true });
					Materialize.toast(notificationString, 2000);
				});
		}

	}
})();
