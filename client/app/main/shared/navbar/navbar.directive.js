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
                        scope.navbar.get_queue_status();
                        scope.navbar.on_event_page = true;
                    } else {
                        scope.navbar.get_queue_status();
                        scope.navbar.on_event_page = false;
                    }
                    scope.navbar.current_scope = $state.current.scopeTitle;
                    return;
                });
            }
        };
    }

})();
