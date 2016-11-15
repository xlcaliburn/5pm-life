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
			$('.button-collapse').sideNav();

			Users.get()
				.then(res => {
					vm.users = res.data;
				});

	    }
	}

})();
