(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($q, $timeout, $uibModalInstance, Events, Venues, Activities) {
		var vm = this;
		vm.selectChanged = selectChanged;
		vm.submit = submit;
		vm.selected_event = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.venues = {};
		vm.title = 'Create Event';

		init();
//WORKING HERE UNFINISHED, having only appropriate venues pop up for activity
//		function init() {
//			console.log("init start");
//			Venues.get()
//				.then(function(res) {
//					vm.allowed_venues = res.data; //This is where the magic happens
//					console.log(res);
//					return Activities.get();
//				})
//				.then(function(res) {
//					vm.allowed_activities = res.data;
//					console.log(res);
//					return res;
//				})
//				.then(function() {
//					$timeout(function() {materialize_select();});
//				})
//				.catch(function(err) {
//					console.log(err);
//				});
//		}

		function init() {
			console.log("init start");
			Activities.get()
				.then(function(res) {
					vm.allowed_activities = res.data; //This is where the magic happens
					console.log(res);
					return Venues.get();
				})
				.then(function(res) {
					vm.allowed_venues = res.data;
					vm.venues = vm.allowed_venues;
					console.log(res);
					return res;
				})
				.then(function() {
					$timeout(function() {materialize_select();});
				})
				.catch(function(err) {
					console.log(err);
				});
		}
//testCTRL for dropdown
		function selectChanged($scope) {
			console.log('function was called');
			console.log(vm.selected_event.activity.tags);
			console.log(Venues.get());

			delete vm.allowed_venues[1];
				delete vm.allowed_venues[2];
					delete vm.allowed_venues[3];

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
