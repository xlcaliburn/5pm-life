'use strict';

angular.module('fivepmApp.admin')
	.config(function($stateProvider) {
		$stateProvider
			.state('admin', {
				url: '/admin',
				templateUrl: 'app/admin/admin.html'
				// controller: 'AdminController',
				// controllerAs: 'admin'
				// authenticate: 'admin'
			})
			.state('admin.tags', {
				url: '/admin/tags',
				templateUrl: 'app/admin/views/manage_tags.html',
				controller: "tagController"
				// authenticate: 'admin'
			})
			.state('admin.venues', {
				url: '/admin/venues',
				templateUrl: 'app/admin/views/manage_venues.html'
			})
		;
	});
