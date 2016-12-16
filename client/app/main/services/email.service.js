'use strict';

angular.module('EmailService', []).factory('EmailService', ['$http', function($http) {

    return {

        // api call save email address
        sendEmail : function(email) {
            return $http.post('/api/email', email);
        }

    };
}]);
