(function() {

    'use strict';
    angular
    .module('RecoveryService', [])
    .factory('RecoveryService', RecoveryService);

    function RecoveryService($http) {
        return {
            // api call for signup verification
            resetPassword : function(data) {
                return $http.post('/api/recovery', data);
            }
        };
    }
})();
