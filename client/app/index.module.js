(function() {
	'use strict';
    angular
	.module('fivepmApp', [
		'fivepmApp.auth',
		'fivepmApp.admin',
		'fivepmApp.constants',
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'btford.socket-io',
		'ui.router',
		'ui.bootstrap',
		'validation.match',
		'EmailService',
		'720kb.datepicker',
		'SignupService',
		'RecoveryService'
	]);
})();
