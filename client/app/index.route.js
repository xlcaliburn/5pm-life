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
			scopeTitle: 'Home',
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
				},
				userData: function($state, Users) {
					return getUser($state, Users).then(function(user) {
						if (!user.verified) {
							$state.go('signup');
						}
					});
				},
			}
		})

		.state('home.event', {
			url: '/event/:id',
			title: '5PM.LIFE Event',
			scopeTitle: 'Event',
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
			scopeTitle: 'Settings',
			templateUrl: 'app/main/settings/settings.html',
			controller: 'SettingsController',
			controllerAs: 'vm',
			resolve: {
				userData: function($state, Users) {
					return getUser($state, Users);
				},
				enumsData: function(Enums) {
					return getEnumData(Enums);
				}
			}
		})

		.state('login', {
			url: '/login',
			title: '5PM.LIFE Login',
			templateUrl: 'app/account/login/login.html',
			controller: 'LoginController',
			controllerAs: 'vm',
			resolve: {
				// if users has token, log them in
				user: function($cookies, $state, $q) {
					var token = $cookies.get('token');

					if (!token) { return; }
					else {
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
			controllerAs: 'signup',
			resolve: {
				userData: function($state, SignupService) {
					return getUserInfo($state, SignupService);
				},
				enumsData: function(Enums) {
					return getEnumData(Enums);
				}
			}
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
			templateUrl: 'app/account/logout/logout.html',
			controller: 'LogoutController',
			controllerAs: 'vm'
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

	// get user data
	getUser.$inject = ['$state', 'Users'];
	function getUser($state, Users) {
		return Users.getMe().then(function(res) {
			var user = res.data;
			if (!user.verified) { $state.go('signup'); }
			return user;
		});
	}

	// get user data (for signup)
	getUserInfo.$inject = ['$state', 'SignupService'];
	function getUserInfo($state, SignupService) {
		return SignupService.getUserInfo().then(function(res) {
			var user = res.data;
			if (user.verified) {
				$state.go('home');
			}
			return user;
		});
	}

	// get enums data
	getEnumData.$inject = ['Enums'];
	function getEnumData(Enums) {
		return Enums.get().then(function(res) {
			return res.data;
		});
	}

})();
