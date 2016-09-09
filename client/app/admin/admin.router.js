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
				controllerAs: 'vm',
				authenticate: 'admin'
			})
			.state('admin.enums', {
				url: '/enums',
				templateUrl: 'app/admin/enums/admin.enums.html',
				controller: 'AdminEnumsController',
				controllerAs: 'vm',
				authenticate: 'admin'
			})
			.state('admin.activities', {
				url: '/activities',
				templateUrl: 'app/admin/activities/admin.activities.html',
				controller: 'AdminActivitiesController',
				controllerAs: 'vm',
				authenticate: 'admin'
			})
			.state('admin.venues', {
				url: '/venues',
				templateUrl: 'app/admin/venues/admin.venues.html',
				controller: 'AdminVenuesController',
				controllerAs: 'vm',
				authenticate: 'admin'
			})
			.state('admin.events', {
				url: '/events',
				templateUrl: 'app/admin/events/admin.events.html',
				controller: 'AdminEventsController',
				controllerAs: 'vm',
				authenticate: 'admin'
			})
			.state('admin.events.edit', {
				url: '/:event_id',
				templateUrl: 'app/admin/events/admin.events.edit.html',
				controller: 'EditEventController',
				controllerAs: 'vm',
				authenticate: 'admin'
			})
			.state('admin.settings', {
				url: '/settings',
				templateUrl: 'app/admin/settings/admin.settings.html',
				controller: 'AdminSettingsController',
				controllerAs: 'vm',
				authenticate: 'admin'
			})
		;
	}
})();
