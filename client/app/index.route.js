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
        ;

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
		enabled: true,
		requireBase: false
    });
    //$locationProvider.html5Mode(true).hashPrefix('!');

  }

})();
