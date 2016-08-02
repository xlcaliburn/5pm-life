'use strict';

(function() {
    /*jslint latedef:false*/

    angular
    .module('fivepmApp')
    .controller('HomeController', HomeController);

    /** @ngInject */
    /*jshint camelcase: false */
    /* jshint expr: true */
    function HomeController($filter, $timeout, $rootScope, $state) {
        var self = this;

        // model
        // should definitely get this from the db
        self.stages = [
            {
                stage: 'datetime',
                instructions: 'Select a <span class="babyblue bold">date</span> and <span class="babyblue bold">time range</span> that you are available'
            },
            {
                stage: 'activity',
                instructions: 'Select an <span class="babyblue bold">activity card</span> you would like your event to be'
            }
        ];
        self.activity_cards = [
            {
                activity_type: 'active',
                color: '#ff5d5d'
            },
            {
                type: 'social',
                color: '#429fd9'
            }
        ];

        // variables
        self.current_stage = 0;
        self.show_calendar = true;
        self.today = get_todays_date();
        self.date;
        self.time_1;
        self.time_2;
        self.formatted_date;
        self.formatted_time_1;
        self.formatted_time_2;
        self.selected_activity_types = [];
        self.active = false;
        self.social = false;
        self.next_button = false;
        self.prev_button = false;

        /* class functions
        =====================================================*/

        self.init = function() {
            // set page title
            $rootScope.title = $state.current.title;

            // remove active calendar highlight from today's date
            $timeout(function() {
                var today_cell = angular.element('._720kb-datepicker-calendar-day._720kb-datepicker-active');
                today_cell.addClass('today-date');
                today_cell.removeClass('_720kb-datepicker-active');
                today_cell.click(function() {
                    today_cell.addClass('_720kb-datepicker-active');
                });
            });
        };

        self.set_date = function() {
            var unformatted_date = moment(self.date);
            self.formatted_date = unformatted_date.format('ddd, MMMM Do, YYYY');

            if (self.formatted_time_1 && self.formatted_time_2) {
                self.next_button = true;
            }
        };

        self.set_time = function() {
            if (!self.time_1 || !self.time_2) { return; }
            if (self.time_1 > self.time_2) { return; }

            // format times
            self.formatted_time_1 = new moment(self.time_1).format('h:mmA');
            self.formatted_time_2 = new moment(self.time_2).format('h:mmA');

            if (self.formatted_date) {
                self.next_button = true;
            }
        };

        self.toggle_activity = function(type) {
            if (self.selected_activity_types.indexOf(type) > -1) {
                // it exists in array
                var index = self.selected_activity_types.indexOf(type);
                self.selected_activity_types.splice(index, 1);

            } else {
                // add to array
                self.selected_activity_types.push(type);
            }

            // show queue button
            if (self.selected_activity_types.length > 0) {
                self.show_ready();
            }
        };

        self.show_ready = function() {

        };

        self.prev_stage = function() {
            if (self.current_stage - 1 < 0) { return; }

            self.next_button = !self.next_button;
            self.prev_button = !self.prev_button;

            self.current_stage--;
        };

        self.next_stage = function() {
            if (self.current_stage + 1 >= self.stages.length) { return; }

            self.next_button = !self.next_button;
            self.prev_button = !self.prev_button;

            self.current_stage++;
        };

        /* Helper functions
        ===========================================*/

        function get_todays_date() {
            var offset = (new Date()).getTimezoneOffset() * 60000;
            var local_time = (new Date(Date.now() - offset)).toISOString().slice(0,10).replace(/-/g,'-');

            return local_time;
        }



        self.init();
    }

})();
