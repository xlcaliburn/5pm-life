(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($q, $timeout, $uibModalInstance, Events, Venues, Activities) {
		var vm = this;
		vm.filter_venues = filterVenues;
		vm.submit = submit;
		vm.selected_event = [];
		vm.allowed_activities = [];
		vm.allowed_venues = [];
		vm.all_venues = [];
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
		function filterVenues()
		{
			vm.allowed_venues = [];
			var current_activity = vm.selected_event.activity.activity_name;
			for (var k=0; k < vm.all_venues.length; k++)
			{
				for (var i=0; i < vm.all_venues[k].allowed_activities.length; i++)
				{
					if (current_activity == vm.all_venues[k].allowed_activities[i].activity_name)
					{
						vm.allowed_venues.push(vm.all_venues[k]);
					}
				}
			}
			$timeout(function() {materialize_select();});
	}

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
