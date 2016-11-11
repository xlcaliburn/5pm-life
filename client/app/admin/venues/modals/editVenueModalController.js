(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EditVenueModalController', EditVenueModalController);

	function EditVenueModalController ($uibModalInstance, Venues, Activities, venueId) {
		var vm = this;
		vm.submit = submit;
		vm.deleteVenue = deleteVenue;

		init();

		function init() {
			Activities.get()
			.then(function(res) {
				vm.valid_activities = res.data;

				// If this is an existing venue
				if(venueId){
					vm.title = 'Edit Venue';
					vm.deleteButtonShow = true;

					Venues.getById(venueId)
					.then((res) => {
						vm.form_data = res.data;
						vm.form_data.valid_activities = [];

						// Check which checkboxes need to be checked on initialization
						for (var i in vm.valid_activities){
							// Check the box only if it is a valid activity AND it was checked as an allowed activity
							if (vm.form_data.allowed_activities.includes(vm.valid_activities[i]._id)){
								vm.form_data.valid_activities[vm.valid_activities[i]._id] = true;
							}
							else{
								vm.form_data.valid_activities[vm.valid_activities[i]._id] = false;
							}
						}
					});
				}
				else{
					vm.title = 'Create New Venue';
					vm.deleteButtonShow = false;
				}
			});
		}

		function submit() {
			var valid = [];
			for (var id in vm.form_data.valid_activities)
			{
				if(vm.form_data.valid_activities[id])
				{
					valid.push(id);
				}
			}
			vm.form_data.allowed_activities = valid;

			if(vm.form_data._id){
				Venues.updateById(vm.form_data._id, vm.form_data)
				.then(()=>$uibModalInstance.close());
			}
			else{
				Venues.create(vm.form_data)
					.then(()=>$uibModalInstance.close());
			}
		}

		function deleteVenue(){
			if (venueId){
				Venues.delete(venueId)
					.then(()=>$uibModalInstance.close())
				;
			}
		}
	}
})();
