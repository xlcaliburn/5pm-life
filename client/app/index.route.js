(function() {
  'use strict';

  angular
    .module('fivepmApp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            title: "Welcome to 5pm.life",
            templateUrl: 'app/main/home/home.html',
            controller: 'HomeController',
            controllerAs: 'main'
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
