(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($q, $timeout, $uibModalInstance, Events, Venues, Activities) {
		var vm = this;
		vm.submit = submit;
		vm.selected_event = {};
		vm.allowed_activities = [];
		vm.all_venues = [];
		vm.allowed_venues = [];
		vm.title = 'Create Event';
		vm.filter_venues = filterVenues;

		init();

		function init() {
			Activities.get()
				.then(function(res) {
					vm.allowed_activities = res.data;
					return Venues.get();
				})
				.then(function(res) {
					vm.all_venues = res.data;
					return res;
				})
				.then(function() {
					$timeout(function() {materialize_select();});
				})
				.catch(function(err) {
					console.log(err);
				});
		}

		function filterVenues()
		{
			var allowed = [];

			/**

				TODO

			**/

			vm.allowed_venues = allowed;
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
