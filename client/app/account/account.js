'use strict';

angular.module('fivepmApp')
	.config(function($stateProvider) {
		$stateProvider.state('logout', {
				url: '/logout',
				template: '',
				controller: function($state, Auth) {
					Auth.logout();
					$state.go('logoutsuccess');
				}
			});
		//   .state('signup', {
		//     url: '/signup',
		//     templateUrl: 'app/account/signup/signup.html',
		//     controller: 'SignupController',
		//     controllerAs: 'vm'
		//   })
			// .state('settings', {
			//   url: '/settings',
			//   templateUrl: 'app/account/settings/settings.html',
			//   controller: 'SettingsController',
			//   controllerAs: 'vm',
			//   authenticate: true
			// });
			/*state('login', {
					url: '/login',
					templateUrl: 'app/account/login/login.html',
					controller: 'LoginController',
					controllerAs: 'vm'
			})*/
	})
	.run(function($rootScope) {
		$rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
			if (next.name === 'logout' && current && current.name && !current.authenticate) {
				next.referrer = current.name;
			}
		});
	});
