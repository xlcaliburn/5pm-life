'use strict';

angular.module('fivepmApp')
.controller('OauthButtonsCtrl', function($window) {
    this.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
});
