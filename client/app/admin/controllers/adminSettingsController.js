"use strict";

angular.module('adminSettingsCtrl', [])
	.controller('adminSettingsController', function($scope, $http, AdminSettings) {
		$scope.formData = {};
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

		AdminSettings.get()
			.success(function(data) {
				if (data.length == 0)
				{
					$scope.adminSettings = defaultSettings;
				}
				else 
				{
					$scope.adminSettings = data;
				}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		$scope.updateSettings = function() {
			if (!$.isEmptyObject($scope.formData)) {
				AdminSettings.create($scope.formData)
					.success(function(data) {
					});
			}
		};
	});