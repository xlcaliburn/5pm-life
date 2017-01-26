(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($q, $timeout, $uibModalInstance, Events, Venues, Activities) {
		var vm = this;
		vm.filterVenues = filterVenues;
		vm.submit = submit;
		vm.selected_event = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.all_venues = {};
		vm.title = 'Create Event';

		init();
		function init() {
			Activities.get()
				.then(function(res) {
					vm.allowed_activities = res.data;
					return Venues.get();
				})
				.then(function(res) {
					vm.allowed_venues = res.data;
					vm.all_venues = vm.allowed_venues;
					return res;
				})
				.then(function() {
					$timeout(function() {materialize_select();});
				})
				.catch(function(err) {
					console.log(err);
				});
		}
		//This Fn ensures that only the appropriate venues are displayed when an
		//activity is selected
		function filterVenues($scope) {
			vm.allowed_venues = [];
			var venue_array = $.map(vm.all_venues, function(value, index) {
				return [value];
			});
			var current_activity = vm.selected_event.activity.activity_name;
			for (var k=0; k<venue_array.length; k++) {
				for (var i=0; i<venue_array[k].allowed_activities.length; i++) {
					if (current_activity == venue_array[k].allowed_activities[i].activity_name) {
						vm.allowed_venues.push(venue_array[k]);
					}//End if
				};//End inside loop
			};//End outside loop
			$timeout(function() {materialize_select();});
	}//End fn

		function submit() {
			vm.selected_event.dt_search_start = new Date().getTime();
			vm.selected_event.status = 'New';
			vm.selected_event.dt_start = new Date().getTime() + 3;
			vm.selected_event.dt_end = new Date().setHours(new Date().getHours() + 3);
			Events.create(vm.selected_event)
				.success(function(data) {
					vm.selected_event = {};
					$uibModalInstance.close(data);
				});
		}
	}

})();
