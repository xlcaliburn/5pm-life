(function () {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminController', AdminController);

    function AdminController(Users)
    {
		var vm = this;
		vm.users = [];
		vm.total_users = 0;

		init();

		function init() {
			$('#button-collapse').sideNav({
				closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
				draggable: true // Choose whether you can drag to open on touch screens
			  }
			);


			Users.get()
				.then(res => {
					vm.users = res.data;
				});

	    }
	}

})();
