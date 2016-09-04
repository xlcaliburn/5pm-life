'use strict';

(function() {
    /*jslint latedef:false*/
    angular
    .module('fivepmApp')
    .directive('navbar', NavbarDirective);

    function NavbarDirective($rootScope, $state) {
        return {
            restrict: 'E',
            templateUrl: 'app/main/shared/navbar/navbar.html',
            transclude : false,
            controller: 'NavbarController',
            controllerAs: 'navbar',
            link: function(scope) {
                $rootScope.$on('$stateChangeSuccess', function() {
                    if ($state.current.name === 'home.event') {
                        scope.navbar.on_event_page = true;
                    } else {
                        scope.navbar.on_event_page = false;
                    }
                });
            }
        };
    }

})();
