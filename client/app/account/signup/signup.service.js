
(function() {

    'use strict';
    angular
    .module('SignupService', [])
    .factory('SignupService', SignupService);

    function SignupService($http) {
        return {
            // api call for signup verification
            submitSignup : function(data) {
                return $http.post('/api/signup', data);
            }
        };
    }
})();
