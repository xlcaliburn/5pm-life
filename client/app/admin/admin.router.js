'use strict';

angular.module('fivepmApp.admin')
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/admin');
		
		$stateProvider
			.state('admin', {
				url: '/admin',
				templateUrl: 'app/admin/admin.html'
				// controller: 'AdminController',
				// controllerAs: 'admin'
				// authenticate: 'admin'
			})
			.state('admin.tags', {
				url: '/tags',
				templateUrl: 'app/admin/views/manage_tags.html',
				controller: "tagController"
				// authenticate: 'admin'
			})
			.state('admin.venues', {
				url: '/venues',
				templateUrl: 'app/admin/views/manage_venues.html',
				controller: "venueController"
			})
		;
	});
