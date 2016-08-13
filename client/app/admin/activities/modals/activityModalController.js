(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('ActivityModalController', ActivityModalController);

	function ActivityModalController ($timeout, $uibModalInstance, Activities, Enums) {
		var vm = this;
		vm.create_form = {};
		vm.validTags = [];
		vm.submit = submit;

		var newTags;

		init();

		function init() {
			Enums.getByType('activity_tags')
				.success(function(data) {
					for(var tag in data) {
						vm.validTags.push(data[tag].key);
					}
					newTags = $('#activity_tags').tags({
						suggestions: vm.validTags,
						restrictTo: vm.validTags,
						suggestOnClick: true
					});
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

		}


		function submit() {
			vm.create_form.tags = newTags.getTags();
			Activities.create(vm.create_form)
				.success(function(data) {
					vm.create_form = {};
					vm.activities = data;
					
					var len = $('#activity_tags').tags().getTags().length;
					for(var i=0; i<len; i++) {
						$('#activity_tags').tags().removeLastTag();
					}

					$uibModalInstance.close(data);
			});
			
		}		
	}

})();