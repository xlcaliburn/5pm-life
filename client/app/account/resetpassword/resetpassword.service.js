(function() {

    'use strict';
    angular
    .module('PasswordResetService', [])
    .factory('PasswordResetService', PasswordResetService);

    function PasswordResetService($http) {
        return {
            // api call for user_id validation
            validateUser: function(data) {
                return $http.post('/api/resetpassword', data);
            },

            // api call for changing password
            changePassword: function(data) {
                var user_id = data.id;
                var url = '/api/resetpassword/' + user_id;
                return $http.put(url, data);
            }
        };
    }
})();
