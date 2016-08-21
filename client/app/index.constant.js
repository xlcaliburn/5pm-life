'use strict';

(function(angular, undefined) {
    angular.module('fivepmApp.constants', [])

    .constant('appConfig', {
        'userRoles': [
            'guest',
            'user',
            'admin'
        ]
    })

    .constant('loading_spinner', '<div class="loading-spinner"></div>')
    .constant('Months', [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'
    ])
    ;
})(angular);
