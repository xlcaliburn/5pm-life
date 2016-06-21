'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($scope, $filter) {
        var self = this;

        // model

        // variables
        self.current_instructions = "Select a date and time range that you are available";
        self.show_calendar = true;
        self.date;

        /* class functions
        =====================================================*/

        self.prev_stage = function() {

        }

        self.next_stage = function() {

        }

        self.set_date = function() {
            console.log(self.date);
        }

    }

})();
