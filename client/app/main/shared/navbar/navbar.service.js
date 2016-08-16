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
            }
        };
    }
})();
