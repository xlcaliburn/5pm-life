'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController() {
        var self = this;

        self.navbarCollapsed = false;

        self.go = function() {
            return false;
        }
    }

})();
