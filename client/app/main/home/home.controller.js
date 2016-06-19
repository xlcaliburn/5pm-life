'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController() {
        var self = this;

        // model

        // variables
        self.current_instructions = "Select a date and time range that you are available";

        /* class functions
        =====================================================*/
        self.prev_stage = function() {

        }

        self.next_stage = function() {

        }
    }

})();
