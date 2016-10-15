'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('LoginController', LoginController);

    /** @ngInject */
    /* jshint expr: true */
    function LoginController($scope, $window) {
        var vm = this;

        // try submitting form
        vm.login = login;

        init();

        $scope.$on('$destroy', correctFooter);

        function correctFooter() {
            angular.element('.body-content').css('height', 'auto');
        }

        function init() {
            angular.element('.body-content').css('height','100%');
        }

        function login() {
            $window.location.href = '/auth/facebook';
        }

    }

})();
