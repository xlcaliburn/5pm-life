(function() { 'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditActivityModalController', ActivityModalController);

	function ActivityModalController ($timeout, $uibModalInstance, Activities, Enums, activityId, Modal) {
		var vm = this;
		vm.create_form = {};
		vm.validTags = [];
		vm.submit = submit;
		vm.deleteButtonShow = false;
		vm.deleteActivity = Modal.confirm.delete(deleteActivity);
		vm.removeRequiredEquipment = removeRequiredEquipment;
		vm.addRequiredEquipment = addRequiredEquipment;
		vm.addReqEquipText = '';

		var newTags;

		init();

		function init() {
			Enums.getByType('activity_tag')
				.success(function(data) {
					for(var tag in data) {
						vm.validTags.push(data[tag]);
					}
					newTags = $('#activity_tags').tags({
						suggestions: vm.validTags,
						restrictTo: vm.validTags,
						suggestOnClick: true
					});
				})
				.error(function(data) {
					console.log('Error: ' + data);
				})
			;

			if (activityId){
				vm.title = 'Edit Activity';
				vm.deleteButtonShow = true;
				Activities.getById(activityId)
				.then((res) => {
					vm.create_form = res.data;
					for(var i in res.data.tags){
						newTags.addTag(res.data.tags[i]);
					}
				});
			}
			else{
				vm.title = 'Create New Activity';
				vm.deleteButtonShow = false;
			}
		}

		function submit() {
			vm.create_form.tags = newTags.getTags();

			if (activityId){
					Activities.updateById(activityId,vm.create_form)
					.then(() => {$uibModalInstance.close();});
			}
			else{
				Activities.create(vm.create_form)
				.then(() => {$uibModalInstance.close();});
			}
		}

		function deleteActivity() {
			if (activityId){
				Activities.delete(activityId)
				.then(()=> {$uibModalInstance.close();});
			}
		}

		function removeRequiredEquipment(index) {
			vm.create_form.required_equipment.splice(index,1);
		}

		function addRequiredEquipment(equipment) {
			equipment = equipment.trim();
			if(equipment.length > 0){
				vm.create_form.required_equipment.push(equipment);
				vm.addReqEquipText = '';
			}
		}
	}
})();
