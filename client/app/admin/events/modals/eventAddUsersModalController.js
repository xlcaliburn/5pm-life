(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventAddUsersModalController', EventAddUsersModalController);

	function EventAddUsersModalController ($uibModalInstance, Users, Queue, Events, eventId) {
		var vm = this;
		vm.queue = {};
		vm.submit = submit;
		var queueArray = [];
		vm.users = [];
		init();

		function init() {

			Users.get()
			.success(function(data) {
				vm.users = data;

			var test = {};
			test.user = vm.users[0]._id;
			test.status = 1;
			test.search_parameters = {};
			test.search_parameters.override_default = false;

			console.log(test);

			Queue.create(test)
				.success(function(data) {
					console.log(data);
				})
				.error(function(data) {
					console.log(data);
				});

			});


			Queue.get()
				.success(function(data) {
					vm.queue = data;
					console.log(data);
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

		function submit() {

		}
	}

})();