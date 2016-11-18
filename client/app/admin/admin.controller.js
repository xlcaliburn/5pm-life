(function () {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminController', AdminController);

    function AdminController(Enums, Users, Queue, Activities, Venues)
    {
		var vm = this;
		vm.enums = [];
		vm.users = [];
		vm.searching_queues = [];
		vm.activities = [];
		vm.venues = [];
		vm.total_users = 0;
		vm.matchmake = () => Queue.matchmake();

		init();

		function init() {
			$('#button-collapse').sideNav({
				closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
				draggable: true // Choose whether you can drag to open on touch screens
			  }
			);
			Enums.get()
				.then(res => {
					vm.enums = res.data;
				})
				.then(() => {
					Users.get()
						.then(res => {
							vm.users = res.data;
						})
					;
					Queue.getByStatus(vm.enums.queue_status.SEARCHING.value)
						.then(res => {
							vm.searching_queues = res.data;
						})
					;
					Activities.get()
						.then(res => {
							vm.activities = res.data;
						})
					;
					Venues.get()
						.then(res => {
							vm.venues = res.data;
						})
					;
				})
			;
	    }
	}

})();
