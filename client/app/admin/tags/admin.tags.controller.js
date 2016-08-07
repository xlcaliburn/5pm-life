(function () {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminTagsController', AdminTagsController);

	function AdminTagsController ($scope, $http, $uibModal, Enums) {
		var vm = this;
		vm.activities = {};
		vm.eventTags = {};
		vm.formData = {};
		vm.get = get;
		vm.deleteEnum = deleteEnum;
		vm.createModal = createModal;

		get();

		function get() {
			getEventTags();
			getActivities();
		}

		function getEventTags() {
			Enums.getTags()
				.success(function(data) {
					vm.eventTags = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function getActivities() {
			Enums.getActivities()
				.success(function(data) {
					vm.activities = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function deleteEnum(id, tagType) {
			Enums.delete(id)
				.success(function(data) {
					vm.get();
				});
		};

		function createModal(tagType) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/tags/modals/createTagModal.html',
				controller: 'CreateTagModalController',
				controllerAs: 'vm',
				size: 'lg',
				resolve: {
					tagType: function () { return tagType; }
				}
			});

			modalInstance.result.then(function() {
				get();
			}, function () {});			
		}
	}
})();