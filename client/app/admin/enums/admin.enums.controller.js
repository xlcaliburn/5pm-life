(function () { 'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('AdminEnumsController', AdminEnumsController);

	function AdminEnumsController ($scope, $http, $uibModal, Enums) {
		var vm = this;
		vm.enums = [];

		init();

		function init() {
			Enums.get()
				.success(function(data) {
					for(var type in data){
						for(var key in data[type]){
							vm.enums.push({
								type:type,
								key:key,
								value:data[type][key].value,
								order:data[type][key].order}
							);
						}
					}
					materialize_select();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
	}
})();
