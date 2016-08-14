'use strict';

(function() {

    angular
    .module('fivepmApp')
    .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController($cookies, $sce, $timeout, NavbarService) {

        /* jshint expr: true */
        var vm = this;

        var token = $cookies.get('token');
        var token_data = {
            token: token
        };
        NavbarService.getToken(token_data).then(function(res) {
            console.log(res);
        });

        // model
        vm.steps = [
            {
                order: 1,
                stage: 'datetime',
                title: 'date and time',
                subtitle: 'Select a date and time of when you are available.',
                tooltip: 'Enter date and time tooltip here'
            },
            {
                order: 2,
                stage: 'activity_type',
                title: 'activity type',
                subtitle: 'Select one or more <span style="color: #429fd9">activity types</span> that you would like your event to be.',
                tooltip: 'Enter activity preference tooltip here'
            },
            {
                order: 3,
                stage: 'location_pref',
                title: 'location preference',
                subtitle: 'Select your preferred event location.',
                tooltip: 'Enter location preference tooltip here',
                locations: [
                    {
                        id: 12345,
                        city: 'Richmond Hill'
                    }
                ]
            }
        ];

        // views
        vm.body = angular.element('body');
        vm.overlay = angular.element('.queue-modal-overlay');
        vm.modal = angular.element('#queue-modal');
        vm.datetime = angular.element('.datetime-stage');

        // variables
        vm.status_title = 'QUEUE FOR EVENT';
        vm.nav_open = false;
        vm.modal_open = false;
        vm.queue_date;
        vm.queue_start_time;
        vm.queue_end_time;
        vm.active = false;
        vm.social = false;
        vm.both = false;
        vm.confirm = false;
        vm.location;

        /*======================================
            Functions
        =======================================*/
        vm.init = function() {
            // init datetime picker
            vm.init_datetimepicker();
            vm.init_tooltips();
        };

        // initialiaze tooltips
        vm.init_tooltips = function() {
            $timeout(function() {
                var tooltips = angular.element('.queue-tooltip');
                tooltips.tooltip();
            });
        };

        // open modal when explore is clicked
        vm.open_queue_modal = function() {
            if (vm.modal_open) { return; }

            vm.body.addClass('modal-open');
            vm.modal.addClass('queue-modal-open');
            vm.modal_open = true;
            materialize_select();
        };

        // close modal when overlay is clicked
        vm.close_queue_modal = function() {
            if (!vm.modal_open) { return; }

            vm.body.removeClass('modal-open');
            vm.modal.removeClass('queue-modal-open');
            vm.modal_open = false;
        };

        vm.confirm_queue = function() {
        // validate information
            vm.clear_errors('all');

        /*================================================
        ================ validate date
        =================================================*/

            // check if date is empty
            if (!vm.queue_date) {
                vm.add_errors('datetime', '#datepicker', 'Please select a date below'); return;
            }

            // check if date is valid
            var selected_date = new Date(vm.queue_date);
            if (selected_date === 'Invalid Date') {
                vm.add_errors('datetime', '#datepicker', 'Please enter a valid date'); return;
            }

            // check if selected date is in the past
            var today = new Date(); today.setHours(0,0,0,0);
            if (selected_date < today) {
                vm.add_errors('datetime', '#datepicker', 'The date you have chosen is in the past');
                return;
            }

        /*================================================
        ================ validate time
        =================================================*/

            // check for empty inputs
            if (!vm.queue_start_time) {
                vm.add_errors('datetime', '.start-timepicker', 'Please select a starting time below');
                return;
            } else if (!vm.queue_end_time) {
                vm.add_errors('datetime', '.end-timepicker', 'Please select an ending time below');
                return;
            }

            // check if time between start and end is at least 3 hours and therefore start time must
            // be less than 9:00PM
            var start_time = parseInt(moment(vm.queue_start_time, ['h:mmA']).format('HHmm')),
                end_time = parseInt(moment(vm.queue_end_time, ['h:mmA']).format('HHmm')),
                modified_start_time = start_time + 300; // time with 3 hour gap

            if (start_time >= 2100) {
                vm.add_errors('datetime', '.start-timepicker', 'Please select an earlier start time');
                return;
            }

            if (modified_start_time > end_time) {
                vm.add_errors('datetime', '.start-timepicker', 'Your available time range needs to be at least 3 hours');
                vm.add_errors('datetime', '.end-timepicker', 'Your available time range needs to be at least 3 hours');
                return;
            }

        /*================================================
        == validate activity type and location preference
        =================================================*/

            // check if activity type is selected
            if (!vm.active && !vm.social) {
                vm.add_errors('activity_type', null, 'Please select an activity type');
                return;
            }

            if (!vm.location) {
                vm.add_errors('location_pref', '.location-select', 'Please select a location preference');
                return;
            }

            // if valid, go to confirmation page
            vm.toggle_confirm_information();
        };

        // confirm information before submitting
        vm.toggle_confirm_information = function() {

            // change status and title
            vm.confirm = !vm.confirm;
            if (vm.confirm) { vm.status_title = 'CONFIRM EVENT PREFERENCES'; }
            else { vm.status_title = 'QUEUE FOR EVENT'; }

            // toggle classes
            angular.element('.stages').toggleClass('confirm');
            angular.element('.confirmation').toggleClass('confirm');
            angular.element('.queue-modal-header').toggleClass('confirm');
            angular.element('.queue-modal-title').toggleClass('confirm');

        };

        // convert string to html
        vm.to_html = function(html) {
            return $sce.trustAsHtml(html);
        };

        vm.toggle_activity = function(activity) {
            if (activity === 'active') {
                if (!vm.active) { vm.both = false; }
            }
            if (activity === 'social') {
                if (!vm.social) { vm.both = false; }
            }
            if (activity === 'both') {
                if (vm.both) {
                    vm.active = true;
                    vm.social = true;
                } else {
                    vm.active = false;
                    vm.social = false;
                }
            }
        };

        // initialize datetime picker
        vm.init_datetimepicker = function() {
            if (vm.datetime) {
                $timeout(function() {
                    // init date
                    var datepicker = angular.element('#datepicker');
                    var yesterday = new Date((new Date()).valueOf()-1000*60*60*24);
                    datepicker.pickadate({
                        format: 'mmmm dd, yyyy',
                        disable: [
                          { from: [0,0,0], to: yesterday }
                        ]
                    });

                    // init start time
                    var start_timepicker = angular.element('#start_timepicker');
                    start_timepicker.pickatime({
                        autoclose: true,
                        twelvehour: true
                    });

                    // init end time
                    var end_timepicker = angular.element('#end_timepicker');
                    end_timepicker.pickatime({
                        autoclose: true,
                        twelvehour: true
                    });
                });
            }
        };

        // returns date with day of week
        vm.get_full_date = function(unformatted_date) {
            var days_of_week = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var new_date = new Date(unformatted_date).getDay(),
                day_of_week = days_of_week[new_date];

            return day_of_week + ', ' + unformatted_date;
        };

        vm.get_formatted_time = function(time) {
            if (!time) { return; }
            if (time.charAt(0) === '0') { return time.substring(1); }
            return time;
        };

        vm.get_location = function(location_id) {
            var list_of_locations;
            for (var i = 0; i < vm.steps.length; i++) {
                if (vm.steps[i].stage === 'location_pref') {
                    list_of_locations = vm.steps[i].locations;
                }
            }

            for (var j = 0; j < list_of_locations.length; j++) {
                if (list_of_locations[j].id === location_id) {
                    return list_of_locations[j].city;
                }
            }

            // else return first location
            return list_of_locations[0].city;
        };

        vm.add_errors = function(type, selector, message) {
            var error = angular.element('div[type="' + type + '"]');

            error.html(message);
            if (type !== 'activity_type') {
                angular.element(selector).addClass('queue-input-error');
            }
        };

        vm.clear_errors = function(element) {
            if (element === 'all') {
                angular.element('.queue-errors').html('');
                angular.element('.queue-input-error').removeClass('queue-input-error');
            }
        };

        /* Here we go */
        vm.init();
    }

})();
