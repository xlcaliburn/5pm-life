	(function () {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminActivitiesController', AdminActivitiesController);

	function AdminActivitiesController ($scope, $http, $uibModal, Enums, Activities) {
		var vm = this;
		vm.activities = {};
		vm.formData = {};
		vm.createModal = createModal;
		vm.deleteActivity = deleteActivity;

		var validTags = [];
		var newTags;

		init();

		function init() {
			Enums.getByType('activity_tag')
				.success(function(data) {
					console.log(data);
					for(var tag in data) {
						validTags.push(data[tag].key);
					}
					console.log(validTags);
					newTags = $('#activity_tags').tags({
						suggestions: validTags,
						restrictTo: validTags,
						suggestOnClick: true
					});
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

				getActivities();
		}

		function getActivities() {

			Activities.get()
				.success(function(data) {
					vm.activities = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function deleteActivity(id) {
			Activities.delete(id)
				.success(function(data) {
					vm.activities = data;
				});
		}

		function createModal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/activities/modals/activityModal.html',
				controller: 'ActivityModalController',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {
				}
			});

			modalInstance.result.then(function(data) {
				vm.activities = data;
			}, function () {});			
		}
	}
})();