(function() {

    'use strict';
    angular
    .module('NavbarService', [])
    .factory('NavbarService', NavbarService);

    function NavbarService($http) {
        return {
            // api call for signup verification
            getToken : function(token) {
                return $http.post('/api/queue/add', token);
            }
        };
    }
})();
