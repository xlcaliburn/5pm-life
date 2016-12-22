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
				user: function($state, Auth) {
					return validateUser($state, Auth);
				}
			}
		})

		.state('test', {
			url: '/test',
			title: 'Testing Queue Modal',
			templateUrl: 'components/queue-modal/test.html',
			controller: 'TestController',
			controllerAs: 'vm'
		})

		.state('home', {
			url: '/home',
			title: '5PM.LIFE - Meet, Share, Experience',
			scopeTitle: 'Home',
			templateUrl: 'app/main/home/home.html',
			controller: 'HomeController',
			controllerAs: 'vm',
			resolve: {
				userVerification: function($cookies, $location, $state, Auth) {
					return redirectUser($cookies, $location, $state, Auth);
				},
				userData: function($state, Users) {
					return getUser($state, Users);
				},
				sectionData: function() {
					// will be api call later
					var data = {
						banner: {
							url: 'assets/images/home/default-banner.jpg',
							title: 'Explore 5PM',
							subtitle: 'Queue up for events happening this weekend!'
						},
						sections: {
							news: {
								name: 'News',
								posts: [
									{
										title: 'It\'s time to skate!',
										date: 'Dec 4, 2016',
										content: '<img src="assets/images/home-2.jpg" width="100%"> <p>For the month of December and January, we will be hosting a number of skating events. Sign up now for any of the available dates using the Explore button to participate in one of our skating events!</p>'
									},
									{
										title: 'BETA Test Launching on Nov 4/5!',
										date: 'Oct 22, 2016',
										content: '<img src="assets/images/home-1.jpg" width="100%"> <p>We’re preparing to launch our BETA test in the upcoming weeks. We have been working hard for the past 6 months and thanks to your feedback and support, we’ve managed to bring you v0.1 of the app! We will be trying to run events every 2 weeks starting Nov 4/5 for the next several months. Sign up above when you are available!</p>'
									}
								]
							},
							about: {
								name: 'About',
								content: '<div class="about-title">A Little Bit About 5PM</div><div class="about-content"><p>Are you looking to meet new people but can\'t meet anyone outside of work? Want to try new events but can\'t get friends to go with you? 5PM is the newest platform that can connect you with the people that you want to meet.</p><p class="align-center"><img src="assets/images/5pm-icon-live.png" width="150px"><br /><span class="light purple-font">share your interests</span> &nbsp; · &nbsp;<span class="light pink-font">exchange ideas</span> &nbsp;·&nbsp; <span class="light aqua-font">create life experiences</span></p><p>5PM aims to matchmake you with the people that you want to actually want to meet while doing activities and events that you actually want to do. Our mission is to help provide a way for you to meet more people, make more friends and have fun!</p>'
							},
							feedback: {
								name: 'Feedback',
								content: 'We are working hard to build this platform for everyone and appreciate all the feedback and suggestions that you give us. If you find a bug or feel like there is something that would should implement to make your experience better on 5PM. please let us know below!',
								types: { // will fetch from Enums
									'BUG': {'order': 1, 'value': 'Bug'},
							        'FEATURE': {'order': 2, 'value': 'Feature'},
							        'COMMENT': {'order': 3, 'value': 'Comment'}
								}
							}
						}
					};
					return data;
				}
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
				user: function($state, Auth) {
					return validateUser($state, Auth);
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
			controller: 'AdminController',
			controllerAs: 'vm',
			authenticate: 'admin'
		});

		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
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

	// redirect user based on cookie
	redirectUser.$inject = ['$cookies', '$location', '$state', 'Auth'];
	function redirectUser($cookies, $location, $state, Auth) {
		return Auth.isLoggedIn(function(isLoggedIn) {
			if (isLoggedIn) {
				if ($cookies.get('req_page')) { $location.path($cookies.get('req_page')); }
			} else {
				if (!$cookies.get('req_page')) {
					var expireDate = new Date(Date.now() + 10000); // cookie expires in 10 minutes
					$cookies.put('req_page', $location.path(), {'expires': expireDate});
				}
				$state.go('login');
			}
		});
	}

	// validate user on login
	validateUser.$inject = ['$state', 'Auth'];
	function validateUser($state, Auth) {
		return Auth.isLoggedIn(function(isLoggedIn) {
			if (isLoggedIn) { $state.go('home'); }
		});
	}

})();
