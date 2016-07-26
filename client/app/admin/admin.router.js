'use strict';

angular.module('fivepmApp.admin')
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/admin');

		$stateProvider
			.state('admin', {
				url: '/admin',
				templateUrl: 'app/admin/admin.html',
				//controller: 'DashboardController',
				controllerAs: 'admin',
				authenticate: 'admin'
			})
			.state('admin.users', {
				url: '/users',
				templateUrl: 'app/admin/views/manage_users.html',
				controller: 'userController'
			})
			.state('admin.tags', {
				url: '/tags',
				templateUrl: 'app/admin/views/manage_tags.html',
				controller: 'tagController'
			})
			.state('admin.venues', {
				url: '/venues',
				templateUrl: 'app/admin/views/manage_venues.html',
				controller: 'venueController'
			})
			.state('admin.events', {
				url: '/events',
				templateUrl: 'app/admin/views/manage_events.html',
				controller: 'eventController'
			})
			.state('admin.settings', {
				url: '/settings',
				templateUrl: 'app/admin/views/admin_settings.html',
				controller: 'AdminSettingsController',
				controllerAs: 'vm'
			})			
		;
	});
