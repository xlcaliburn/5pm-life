(function() {
	'use strict';

	angular
		.module('fivepmApp')
		.config(routerConfig);

	/** @ngInject */
function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state('welcome', {
			url: '/',
			title: 'Welcome to 5pm.life',
			templateUrl: 'app/main/welcome/welcome.html',
			controller: 'WelcomeController',
			controllerAs: 'welcome'
		})

		.state('home', {
			url: '/home',
			title: '5pm.life Home',
			templateUrl: 'app/main/home/home.html',
			controller: 'HomeController',
			controllerAs: 'home'
		})

		.state('home.event', {
			url: '/event/:id',
			templateUrl: 'app/main/event/event.html',
			controller: 'EventController',
			controllerAs: 'event',
			resolve: {
				/*
				auth: function($cookies, $state, NavbarService) {
					var user_token = $cookies.get('token');

					if (!user_token) {
						return $state.go('login');
					}

					var token = {
						token: user_token
					};

					return NavbarService.getToken(token).then(function(res) {
						var user_id = res.data.user_id;
						return {
							user_id: user_id
						};
					});
				}*/
			}
		})

		.state('home.settings', {
			title: '5pm Settings',
			url: '/settings',
			templateUrl: 'app/main/settings/settings.html',
			controller: 'SettingsController',
			controllerAs: 'settings',
			resolve: {
				user: function($cookies, $state, SettingsService) {
					var token = $cookies.get('token');
					if (!token) {
						return $state.go('login');
					}
					return SettingsService.getUserSettings(token).then(function(res) {
						if (res.data.response.status == 'ok') {
							return res.data.response.user;
						} else if (res.data.response.status == 'error') {
							return res.data.response.error;
						}
						return $state.go('login');
					});
				}
			}
		})

		.state('login', {
			url: '/login',
			title: '5PM Login',
			templateUrl: 'app/account/login/login.html',
			controller: 'LoginController',
			controllerAs: 'login'
		})

		.state('signup', {
			url: '/signup',
			title: '5PM Signup',
			templateUrl: 'app/account/signup/signup.html',
			controller: 'SignupController',
			controllerAs: 'signup'
		})

		.state('verify', {
			url: '/signup/verify/:id',
			title: 'Verify Email',
			templateUrl: 'app/account/signup/verify.html',
			controller: 'VerifyController',
			controllerAs: 'verify'
		})

		.state('recovery', {
			url: '/recovery',
			title: 'Forgot Password',
			templateUrl: 'app/account/recovery/recovery.html',
			controller: 'RecoveryController',
			controllerAs: 'recovery'
		})

		.state('resetpassword', {
			url: '/passwordreset/:id',
			title: 'Reset Password',
			templateUrl: 'app/account/resetpassword/resetpassword.html',
			controller: 'ResetPasswordController',
			controllerAs: 'reset'
		})

		.state('admin', {
			url: '/admin',
			templateUrl: 'app/admin/admin.html'
			//controller: 'DashboardController',
			//controllerAs: 'admin',
			//authenticate: 'admin'
		})
	;

	$urlRouterProvider.otherwise('/');

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	//$locationProvider.html5Mode(true).hashPrefix('!');

  }

})();
