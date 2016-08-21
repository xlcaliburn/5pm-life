'use strict';

(function() {
    /*jslint latedef:false*/
    angular
    .module('fivepmApp')
    .directive('stickyFooter', FooterDirective);

    function FooterDirective() {
        return {
            restrict: 'E',
            templateUrl: 'app/main/shared/footer/footer.html',
            scope: true,
            transclude : false,
            replace: true,
            controller: 'FooterController',
            controllerAs: 'footer'
        };
    }

})();
