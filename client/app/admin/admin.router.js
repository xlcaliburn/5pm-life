'use strict';

(function() {
	angular
		.module('fivepmApp.admin', ["ui.router"])
		.config(adminConfig);
		
	function adminConfig($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('admin', {
				url: '/admin',
				templateUrl: 'app/admin/admin.html'
				//controller: 'DashboardController',
				//controllerAs: 'admin',
				//authenticate: 'admin'
			})
			.state('admin.users', {
				url: '/users',
				templateUrl: 'app/admin/users/admin.users.html',
				controller: 'AdminUsersController'
			})
			.state('admin.tags', {
				url: '/tags',
				templateUrl: 'app/admin/tags/admin.tags.html',
				controller: 'AdminTagsController'
			})
			.state('admin.venues', {
				url: '/venues',
				templateUrl: 'app/admin/venues/admin.venues.html',
				controller: 'AdminVenuesController'
			})
			.state('admin.events', {
				url: '/events',
				templateUrl: 'app/admin/events/admin.events.html',
				controller: 'AdminEventsController',
				controllerAs: 'vm'
			})
			.state('admin.settings', {
				url: '/settings',
				templateUrl: 'app/admin/settings/admin.settings.html',
				controller: 'AdminSettingsController',
				controllerAs: 'vm'
			})			
		;
	}
})();