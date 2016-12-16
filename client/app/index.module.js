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
		'720kb.datepicker',
		'slickCarousel',
		'ui.router',
		'ui.bootstrap',
		'validation.match',
		'EmailService',
		'SignupService',
		'RecoveryService',
		'PasswordResetService',
		'NavbarService',
		'SettingsService',
		'EventService'
	]);
})();
