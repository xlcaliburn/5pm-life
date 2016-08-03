'use strict';

(function () {
	angular
	.module('fivepmApp.admin')
	.controller('AdminSettingsController', AdminSettingsController);

	function AdminSettingsController($scope, $http, AdminSettings) {
		var vm = this;
		vm.formData = {};
		
		var defaultSettings = [
			{
				settingType: "EventSearchDateTime",
				description: "Event Search DateTime",
				settings: [
					[{
						setting: "min_time_before_start",
						value: "6",
						description: "Minimum time before event start time (hours)",
						type: "number"
					}, {
						setting: "max_time_before_start",
						value: "96",
						description: "Maximum time before event start time (hours)",
						type: "number"
					}],

					[{
						setting: "min_event_search_time",
						value: "4",
						description: "Minimum event search time gap (hours)",
						type: "number"	
					}, {
						setting: "max_event_search_time",
						value: "8",
						description: "Maximum event search time gap (hours)",
						type: "number"
					}]
				]
			},
			{
				settingType: "EventMatchmakingConfig",
				description: "Event Matchmaking Configuration",
				settings: [
					[{				
						setting: "queue_search_time_alert",
						value: "6",
						description: "Queue search time to alert Admin (hours)",
						type: "number"
					}]
				]
			}
		];
		vm.updateSettings = function() {
			if (!$.isEmptyObject(vm.formData)) {
				AdminSettings.create(vm.formData)
					.success(
						function(data) {}
					);
			}
		};

		AdminSettings.get()
			.success(function(data) {
				if (data.length == 0)
				{
					vm.adminSettings = defaultSettings;
				}
				else 
				{
					vm.adminSettings = data;
				}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});		
	}
})();