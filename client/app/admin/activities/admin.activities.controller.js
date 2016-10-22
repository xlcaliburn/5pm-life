(function () {	'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('AdminActivitiesController', AdminActivitiesController);

	function AdminActivitiesController ($scope, $http, $uibModal, Enums, Activities) {
		var vm = this;
		vm.createModal = createModal;
		vm.deleteActivity = deleteActivity;
		vm.activities = {};
		vm.formData = {};

		var validTags = [];
		var newTags;

		init();

		function init() {
			Enums.getByType('activity_tag')
				.then(function(res) {
					for(var tag in res.data) {
						validTags.push(res.data[tag]);
					}
					newTags = $('#activity_tags').tags({
						suggestions: validTags,
						restrictTo: validTags,
						suggestOnClick: true
					});
				})
				.catch((err)=>console.log('Error: ' + err));

			Activities.get()
				.then(function(res) {
					vm.activities = res.data;
				})
				.catch((err)=>console.log('Error: ' + err))
			;
		}

		function deleteActivity(id) {
			Activities.delete(id)
				.then(()=>init());
		}

		function createModal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/activities/modals/activityModal.html',
				controller: 'ActivityModalController',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {}
			});
			modalInstance.result.then(()=>init());
		}
	}
})();
