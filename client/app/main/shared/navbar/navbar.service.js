(function() {

    'use strict';
    angular
    .module('NavbarService', [])
    .factory('NavbarService', NavbarService);

    function NavbarService($http) {
        return {
            // add user to queue
            addToQueue: function(data) {
                return $http.post('/api/queue', data);
            },
            getUserQueueStatus: function(token) {
                var url = 'api/queue/user/' + token;
                return $http.get(url);
            },
            cancelUserQueue: function(token) {
                var url = 'api/queue/cancel/' + token;
                return $http.get(url);
            }
        };
    }
})();
