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
			title: '5PM.LIFE - Meet, Share, Experience',
			templateUrl: 'app/main/welcome/welcome.html',
			controller: 'WelcomeController',
			controllerAs: 'welcome',
			resolve: {
				// if users has token, log them in
				user: function($cookies, $state, $q) {
					var token = $cookies.get('token');

					if (!token) {
						return;
					} else {
						return $q.reject().catch(function() {
							$state.go('home');
						});
					}
				}
			}
		})

		.state('home', {
			url: '/home',
			title: '5PM.LIFE - Meet, Share, Experience',
			templateUrl: 'app/main/home/home.html',
			controller: 'HomeController',
			controllerAs: 'home',
			resolve: {
				user: function($cookies, $q, $state, SettingsService) {
					var token = $cookies.get('token');
					if (!token) {
						return $q.reject().catch(function() {
							if (!$cookies.get('req_page')) {
								var current_url = window.location.href;
								var expireDate = new Date(Date.now() + 10000); // cookie expires in 10 minutes
								$cookies.put('req_page', current_url, {'expires': expireDate});
							}
							$state.go('login');
						});
					} else {
						return SettingsService.getUserSettings(token).then(function(res) {
							if (res.data.response.status === 'ok') {
								return res.data.response.user;
							} else if (res.data.response.status === 'error') {
								return res.data.response.error;
							}
							return $q.reject().catch(function() {
								$state.go('login');
							});
						});
					}
				}
			}
		})

		.state('home.event', {
			url: '/event/:id',
			title: '5PM.LIFE Event',
			templateUrl: 'app/main/event/event.html',
			controller: 'EventController',
			controllerAs: 'vm',
			resolve: {
				event_data: function($q, $state, $stateParams, EventService) {
					var event_id = $stateParams.id;

					if (!event_id) {
						return $q.reject().catch(function() {
							$state.go('home');
						});
					}

					return EventService.getEventModel(event_id).then(function(res) {
						var status = res.data.response.status;
						if (status !== 'ok') {
							return $q.reject().catch(function() {
								$state.go('home');
							});
						}

						return res.data.response.event_model;
					});
				},
				attendees: function($q, $state, $stateParams, EventService) {
					var event_id = $stateParams.id;

					return EventService.getEventAttendees(event_id).then(function(res) {
						if (res.data.response.status === 'ok') {
							return res.data.response.attendees;
						} else {
							return $q.reject().catch(function() {
								$state.go('home');
							});
						}
					}).catch(function() {
						return $q.reject().catch(function() {
							$state.go('home');
						});
					});
				}
			}
		})

		.state('home.settings', {
			title: 'Settings',
			url: '/settings',
			templateUrl: 'app/main/settings/settings.html',
			controller: 'SettingsController',
			controllerAs: 'settings',
			resolve: {
				user: function($cookies, $q, $state, $timeout, SettingsService) {
					var token = $cookies.get('token');
					return SettingsService.getUserSettings(token).then(function(res) {
						if (res.data.response.status === 'ok') {
							return res.data.response.user;
						} else if (res.data.response.status === 'error') {
							return $q.reject().catch(function() {
								$state.go('login');
							});
						}
						return $q.reject().catch(function() {
							$state.go('login');
						});
					});
				}
			}
		})

		.state('login', {
			url: '/login',
			title: '5PM.LIFE Login',
			templateUrl: 'app/account/login/login.html',
			controller: 'LoginController',
			controllerAs: 'login',
			resolve: {
				// if users has token, log them in
				user: function($cookies, $state, $q) {
					var token = $cookies.get('token');

					if (!token) {
						return;
					} else {
						return $q.reject().catch(function() {
							$state.go('home');
						});
					}
				}
			}
		})

		.state('signup', {
			url: '/signup',
			title: '5PM.LIFE Signup',
			templateUrl: 'app/account/signup/signup.html',
			controller: 'SignupController',
			controllerAs: 'signup'
		})

		.state('verify', {
			url: '/signup/verify/:id',
			title: '5PM.LIFE Verify Email',
			templateUrl: 'app/account/signup/verify.html',
			controller: 'VerifyController',
			controllerAs: 'verify'
		})

		.state('recovery', {
			url: '/recovery',
			title: '5PM.LIFE Forgot Password',
			templateUrl: 'app/account/recovery/recovery.html',
			controller: 'RecoveryController',
			controllerAs: 'recovery'
		})

		.state('resetpassword', {
			url: '/passwordreset/:id',
			title: '5PM.LIFE Reset Password',
			templateUrl: 'app/account/resetpassword/resetpassword.html',
			controller: 'ResetPasswordController',
			controllerAs: 'reset'
		})

		.state('logoutsuccess', {
			url: '/logoutsuccess',
			title: '5PM.LIFE Logout',
			templateUrl: 'app/account/logout/logout.html'
		})

		.state('admin', {
			url: '/admin',
			templateUrl: 'app/admin/admin.html',
			//controller: 'DashboardController',
			//controllerAs: 'admin',
			authenticate: 'admin'
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
