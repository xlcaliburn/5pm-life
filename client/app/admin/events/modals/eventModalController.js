(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($q, $timeout, $uibModalInstance, Events, Venues, Activities) {
		var vm = this;
		vm.submit = submit;
		vm.selected_event = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.title = 'Create Event';

		init();

		function init() {
			Venues.get()
				.then(function(res) {
					vm.allowed_venues = res.data;
					return Activities.get();
				})
				.then(function(res) {
					vm.allowed_activities = res.data;
					return res;
				})
				.then(function() {
					$timeout(function() {materialize_select();});
				})
				.catch(function(err) {
					console.log(err);
				});
		}

		function submit() {
			vm.selected_event.dt_search_start = new Date().getTime();
			Events.create(vm.selected_event)
				.success(function(data) {
					vm.selected_event = {};
					$uibModalInstance.close(data);
				});
		}
	}

})();