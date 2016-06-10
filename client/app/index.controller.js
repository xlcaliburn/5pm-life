(function() {
    'use strict';

    angular
    .module('fivepmApp')
    .controller('MainController', MainController);

    // @ngInject
    function MainController($scope, $rootScope, $state) {

        //Set page title
        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.title = $state.current.title;
        });

    }
})();
