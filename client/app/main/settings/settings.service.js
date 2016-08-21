(function() {

    'use strict';
    angular
    .module('SettingsService', [])
    .factory('SettingsService', SettingsService);

    function SettingsService($http) {
        return {
            getUserSettings: function(token) {                
                var url = "/api/users/settings/" + token;
                return $http.get(url);
            }
        }
    }
})();
