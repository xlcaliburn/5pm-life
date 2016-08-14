(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventAddUsersModalController', EventAddUsersModalController);

	function EventAddUsersModalController ($q, $timeout, $uibModalInstance, Users, Queue, Events, selectedQueue) {
		var vm = this;
		vm.queue = {};
		vm.submit = submit;
		var queueArray = [];

		init();

		function init() {

			Queue.get()
				.success(function(data) {
					vm.queue = data;
					//console.log(data);
					// for(var o in vm.queue) {
					// 	queueArray.push(dataObject[o]);
					// }				
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

		} 

		function addUser() {

			
			// (vm.selectedEvent)
			// 	.success(function(data) {
			// 		vm.selectedEvent = {};
			// 		$uibModalInstance.close(data);
			// 	});
		}
	}

})();