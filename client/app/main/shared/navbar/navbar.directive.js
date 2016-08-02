'use strict';

(function() {
    /*jslint latedef:false*/
    angular
    .module('fivepmApp')
    .directive('navbar', NavbarDirective);

    function NavbarDirective() {
        return {
            restrict: 'E',
            templateUrl: 'app/main/shared/navbar/navbar.html',
            scope: true,
            transclude : false,
            controller: 'NavbarController',
            controllerAs: 'navbar'
        };
    }

})();
