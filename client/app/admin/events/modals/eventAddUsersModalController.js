(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventModalController', EventModalController);

	function EventModalController ($q, $timeout, $uibModalInstance, Users, Queue, Events, Venues, Activities) {
		var vm = this;
		vm.queue = {};
		vm.submit = submit;
		var queueArray = [];

		init();

		function init() {

			Queue.get()
				.success(function(data) {
					vm.queue = data;
					
					for(var o in vm.queue) {
						queueArray.push(dataObject[o]);
					}				
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Users.getUsersById(queueArray)
				.success(function(data) {
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}

		function init_materialize() {
			$timeout(function() {materialize_select();});
		}

		function submit() {
			vm.selectedEvent.dt_search_start = new Date().getTime();
			Events.create(vm.selectedEvent)
				.success(function(data) {
					vm.selectedEvent = {};
					$uibModalInstance.close(data);
				});
		}
	}

})();