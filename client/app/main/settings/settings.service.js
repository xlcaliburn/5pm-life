(function() {

    'use strict';
    angular
    .module('SettingsService', [])
    .factory('SettingsService', SettingsService);

    function SettingsService($http) {
        return {
            getUserSettings: function(token) {
                var url = '/api/users/settings/' + token;
                return $http.get(url);
            },
            uploadProfilePicture: function(formData) {
                var request = $http({
                    method: 'post',
                    url: '/api/upload/avatar',
                    data: formData,
                    processData: false,
                    contentType: false,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
                return request.then(function(res) {
                    return res;
                });
            }
        };
    }
})();
