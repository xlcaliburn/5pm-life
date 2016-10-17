(function() { 'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EventAddUsersModalController', EventAddUsersModalController);

	function EventAddUsersModalController ($uibModalInstance, $filter, Enums, Users, Queue, Events, eventId) {
		var vm = this;
		vm.event = {};
		vm.queues = {}; // Get all valid queues
		vm.submit = submit;
		vm.get_age = function(date){ return moment().diff(date, 'years');};
		vm.get_formatted_date = function(date) { return moment(date).format('MMM DD, YY | h:mm a');};
		vm.selected_queue = []; // Get queues to add to event from html
		vm.queue_ids = [];
		vm.queue_user_ids = []; // Get users corresponding to selected ids
		vm.enum_status = [];

		init();

		function init() {
			Queue.getByStatus('Searching')
				.success(function(data) {
					vm.queues = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Events.getById(eventId)
				.success(function(data) {
					vm.event = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});

			Enums.getByType('queue_status')
				.success(function(data) {
					vm.enum_status = data;
				});
		}

		function submit() {
			$uibModalInstance.close(vm.selected_queue);
		}
	}

})();
