'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($filter, $timeout, $rootScope, $state) {
        var self = this;

        // model


        // variables
        self.current_instructions = "Select a date and time range that you are available";
        self.show_calendar = true;
        self.today = get_todays_date();
        self.date;
        self.time;
        self.formatted_date = "Please select a date";
        self.formatted_time = "Please select a time";

        /* class functions
        =====================================================*/

        self.init = function() {
            // set page title
            $rootScope.title = $state.current.title;

            // remove active calendar highlight from today's date
            $timeout(function() {
                var today_cell = angular.element("._720kb-datepicker-calendar-day._720kb-datepicker-active");
                today_cell.addClass("today-date");
                today_cell.removeClass("_720kb-datepicker-active");
                today_cell.click(function() {
                    today_cell.addClass("_720kb-datepicker-active")
                });
            });
        }

        self.prev_stage = function() {

        }

        self.next_stage = function() {

        }

        self.set_date = function() {
            var unformatted_date = moment(self.date);
            self.formatted_date = unformatted_date.format("ddd, MMMM Do, YYYY");
            console.log(self.date, self.today);
        }

        self.reset_date = function() {
            self.date = $filter('date')(new Date(), 'yyyy-MM-dd');
            angular.element('datepicker').attr('date-set')
        }

        /* Helper functions
        ===========================================*/

        function get_todays_date() {
            var offset = (new Date()).getTimezoneOffset() * 60000;
            var local_time = (new Date(Date.now() - offset)).toISOString().slice(0,10).replace(/-/g,"-");

            return local_time;
        }

        self.init();
    }

})();
