'use strict';

(function() {
	angular
		.module('fivepmApp.admin')
		.config(adminConfig);
				
	function adminConfig($stateProvider) {
		$stateProvider
			.state('admin.users', {
				url: '/users',
				templateUrl: 'app/admin/users/admin.users.html',
				controller: 'AdminUsersController',
				controllerAs: 'vm'
			})
			.state('admin.tags', {
				url: '/tags',
				templateUrl: 'app/admin/tags/admin.tags.html',
				controller: 'AdminTagsController',
				controllerAs: 'vm'
			})
			.state('admin.venues', {
				url: '/venues',
				templateUrl: 'app/admin/venues/admin.venues.html',
				controller: 'AdminVenuesController',
				controllerAs: 'vm'
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