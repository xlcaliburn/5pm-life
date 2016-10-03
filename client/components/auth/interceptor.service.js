'use strict';

(function() {

    function authInterceptor($rootScope, $q, $cookies, $injector, Util) {
        var state;
        return {
            // Add authorization token to headers
            request(config) {
                config.headers = config.headers || {};
                if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
                    config.headers.Authorization = 'Bearer ' + $cookies.get('token');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError(response) {
                if (response.status === 401) {
                    /*var current_url = window.location.href;
                    var expireDate = new Date(Date.now() + 10000); // cookie expires in 10 minutes
                    $cookies.put('req_page', current_url, {'expires': expireDate});*/
                    (state || (state = $injector.get('$state')))
                    .go('login');
                    // remove any stale tokens
                    $cookies.remove('token');
                }
                return $q.reject(response);
            }
        };
    }

    angular.module('fivepmApp.auth')
    .factory('authInterceptor', authInterceptor);
})();
