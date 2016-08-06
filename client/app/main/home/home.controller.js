'use strict';

(function() {

    angular
    .module('fivepmApp')
    .controller('HomeController', HomeController);

    /** @ngInject */
    /* jshint expr: true */
    function HomeController($filter, $timeout, $rootScope, $state) {
        var vm = this;

        // model
        // should definitely get this from the db
        vm.stages = [
            {
                stage: 'datetime',
                instructions: 'Select a <span class="babyblue bold">date</span> and <span class="babyblue bold">time range</span> that you are available'
            },
            {
                stage: 'activity',
                instructions: 'Select an <span class="babyblue bold">activity card</span> you would like your event to be'
            }
        ];
        vm.activity_cards = [
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
        vm.current_stage = 0;
        vm.show_calendar = true;
        vm.today = get_todays_date();
        vm.date;
        vm.time_1;
        vm.time_2;
        vm.formatted_date;
        vm.formatted_time_1;
        vm.formatted_time_2;
        vm.selected_activity_types = [];
        vm.active = false;
        vm.social = false;
        vm.next_button = false;
        vm.prev_button = false;

        /* class functions
        =====================================================*/

        vm.init = function() {
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

        vm.set_date = function() {
            var unformatted_date = moment(vm.date);
            vm.formatted_date = unformatted_date.format('ddd, MMMM Do, YYYY');

            if (vm.formatted_time_1 && vm.formatted_time_2) {
                vm.next_button = true;
            }
        };

        vm.set_time = function() {
            if (!vm.time_1 || !vm.time_2) { return; }
            if (vm.time_1 > vm.time_2) { return; }

            // format times
            vm.formatted_time_1 = new moment(vm.time_1).format('h:mmA');
            vm.formatted_time_2 = new moment(vm.time_2).format('h:mmA');

            if (vm.formatted_date) {
                vm.next_button = true;
            }
        };

        vm.toggle_activity = function(type) {
            if (vm.selected_activity_types.indexOf(type) > -1) {
                // it exists in array
                var index = vm.selected_activity_types.indexOf(type);
                vm.selected_activity_types.splice(index, 1);

            } else {
                // add to array
                vm.selected_activity_types.push(type);
            }

            // show queue button
            if (vm.selected_activity_types.length > 0) {
                vm.show_ready();
            }
        };

        vm.show_ready = function() {

        };

        vm.prev_stage = function() {
            if (vm.current_stage - 1 < 0) { return; }

            vm.next_button = !vm.next_button;
            vm.prev_button = !vm.prev_button;

            vm.current_stage--;
        };

        vm.next_stage = function() {
            if (vm.current_stage + 1 >= vm.stages.length) { return; }

            vm.next_button = !vm.next_button;
            vm.prev_button = !vm.prev_button;

            vm.current_stage++;
        };

        /* Helper functions
        ===========================================*/

        function get_todays_date() {
            var offset = (new Date()).getTimezoneOffset() * 60000;
            var local_time = (new Date(Date.now() - offset)).toISOString().slice(0,10).replace(/-/g,'-');

            return local_time;
        }



        vm.init();
    }

})();
