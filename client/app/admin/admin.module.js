(function() {
	'use strict';

	angular.module('fivepmApp.admin', [
		'fivepmApp.auth', 
		'ui.router', 
		'tagCtrl',
		'venueCtrl',
		'userCtrl',
		'adminEventCtrl',
		'adminSettingsCtrl',
		'apiService'
	]);
})();