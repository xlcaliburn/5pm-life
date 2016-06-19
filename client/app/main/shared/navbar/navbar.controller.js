'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController() {
        var self = this;

        self.navbarCollapsed = false;
        self.full_name = "Michael Wong";

        self.go = function() {
            return false;
        }
    }

})();