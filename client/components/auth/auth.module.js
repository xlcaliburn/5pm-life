'use strict';

angular.module('fivepmApp.auth', ['fivepmApp.constants', 'fivepmApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
