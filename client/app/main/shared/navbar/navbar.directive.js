'use strict';

(function() {
    angular
    .module("fivepmApp")
    .directive("navbar", NavbarDirective);

    function NavbarDirective() {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/navbar/navbar.html',
            scope: true,
            transclude : false,
            controller: 'NavbarController',
            controllerAs: 'navbar'
        };
    }

})();
