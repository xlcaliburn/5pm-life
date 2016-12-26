(function() { 'use strict';
    angular
        .module('fivepmApp')
        .controller('NavbarController', NavbarController);

    function NavbarController($rootScope, $scope, $state, Users) {
        var vm = this;

        // model
        vm.user = {};

        // variables
        vm.on_event_page = false;
        vm.current_state;
        vm.mobile_nav_open = false;

        // functions
        init();

        function init() {
            updateUserInfo();
            // detect when user info needs to be updated
            $scope.$on('updateUser', updateUserInfo);
            setScope($state.current);
            // display current scope title
            $rootScope.$on('$stateChangeSuccess',
            function(event, toState){
                setScope(toState);
            });
        }

        function setScope(title) {
            vm.current_scope = title;
        }

        function updateUserInfo() {
            Users.getMe()
            .then(function(res) {
                vm.user = res.data;
            });
        }
    }
})();
