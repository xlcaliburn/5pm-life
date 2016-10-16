'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('LogoutController', LogoutController);

    /** @ngInject */
    /* jshint expr: true */
    function LogoutController($location, $scope, $timeout) {

        init();
        var timeout;

        $scope.$on('$destroy', destroy);

        function init() {
            timeout = $timeout(function() {
                $location.url('/');
            }, 5000);
        }

        function destroy() {
            $timeout.cancel(timeout);
        }

    }
})();
