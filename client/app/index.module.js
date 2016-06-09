(function() {
    'use strict';

    angular
        .module('5pmApp', ['5pmApp.auth', '5pmApp.admin', '5pmApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap','validation.match']);

})();
