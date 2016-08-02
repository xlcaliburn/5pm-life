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

		.state('event', {
			url: '/event/:id',
			templateUrl: 'app/main/event/event.html',
			controller: 'EventController',
			controllerAs: 'event'
		})

		.state('home.settings', {
			title: '5pm Settings',
			url: '/settings',
			templateUrl: 'app/main/settings/settings.html'
		})

		.state('login', {
			url: '/login',
			title: '5PM Login',
			templateUrl: 'app/account/login/login.html',
			controller: 'LoginController',
			controllerAs: 'login'
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
