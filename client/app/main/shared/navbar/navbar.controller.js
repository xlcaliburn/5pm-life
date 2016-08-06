'use strict';

(function() {

    angular
    .module('fivepmApp')
    .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController($sce, $timeout) {


        /* jshint expr: true */
        var self = this;

        // model
        self.steps = [
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
        self.body = angular.element('body');
        self.overlay = angular.element('.queue-modal-overlay');
        self.modal = angular.element('#queue-modal');
        self.datetime = angular.element('.datetime-stage');

        // variables
        self.status_title = 'QUEUE FOR EVENT';
        self.nav_open = false;
        self.modal_open = false;
        self.queue_date;
        self.queue_start_time;
        self.queue_end_time;
        self.active = false;
        self.social = false;
        self.both = false;
        self.confirm = false;
        self.location;

        /*======================================
            Functions
        =======================================*/
        self.init = function() {
            // init datetime picker
            self.init_datetimepicker();
            self.init_tooltips();
        };

        // initialiaze tooltips
        self.init_tooltips = function() {
            $timeout(function() {
                var tooltips = angular.element('.queue-tooltip');
                tooltips.tooltip();
            });
        };

        // open modal when explore is clicked
        self.open_queue_modal = function() {
            if (self.modal_open) { return; }

            self.body.addClass('modal-open');
            self.modal.addClass('queue-modal-open');
            self.modal_open = true;
        };

        // close modal when overlay is clicked
        self.close_queue_modal = function() {
            if (!self.modal_open) { return; }

            self.body.removeClass('modal-open');
            self.modal.removeClass('queue-modal-open');
            self.modal_open = false;
        };

        self.confirm_queue = function() {
        // validate information
            self.clear_errors('all');

        /*================================================
        ================ validate date
        =================================================*/

            // check if date is empty
            if (!self.queue_date) {
                self.add_errors('datetime', '#datepicker', 'Please select a date below'); return;
            }

            // check if date is valid
            var selected_date = new Date(self.queue_date);
            if (selected_date === 'Invalid Date') {
                self.add_errors('datetime', '#datepicker', 'Please enter a valid date'); return;
            }

            // check if selected date is in the past
            var today = new Date(); today.setHours(0,0,0,0);
            if (selected_date < today) {
                self.add_errors('datetime', '#datepicker', 'The date you have chosen is in the past');
                return;
            }

        /*================================================
        ================ validate time
        =================================================*/

            // check for empty inputs
            if (!self.queue_start_time) {
                self.add_errors('datetime', '.start-timepicker', 'Please select a starting time below');
                return;
            } else if (!self.queue_end_time) {
                self.add_errors('datetime', '.end-timepicker', 'Please select an ending time below');
                return;
            }

            // check if time between start and end is at least 3 hours and therefore start time must
            // be less than 9:00PM
            var start_time = parseInt(moment(self.queue_start_time, ['h:mmA']).format('HHmm')),
                end_time = parseInt(moment(self.queue_end_time, ['h:mmA']).format('HHmm')),
                modified_start_time = start_time + 300; // time with 3 hour gap

            if (start_time >= 2100) {
                self.add_errors('datetime', '.start-timepicker', 'Please select an earlier start time');
                return;
            }

            if (modified_start_time > end_time) {
                self.add_errors('datetime', '.start-timepicker', 'Your available time range needs to be at least 3 hours');
                self.add_errors('datetime', '.end-timepicker', 'Your available time range needs to be at least 3 hours');
                return;
            }

        /*================================================
        == validate activity type and location preference
        =================================================*/

            // check if activity type is selected
            console.log(self.active, self.social);
            if (!self.active && !self.social) {
                self.add_errors('activity_type', null, 'Please select an activity type');
                return;
            }

            if (!self.location) {
                self.add_errors('location_pref', '.location-select', 'Please select a location preference');
                return;
            }

            // if valid, go to confirmation page
            self.toggle_confirm_information();
        };

        // confirm information before submitting
        self.toggle_confirm_information = function() {
            // change status and title
            self.confirm = !self.confirm;
            if (self.confirm) { self.status_title = 'CONFIRM EVENT PREFERENCES'; }
            else { self.status_title = 'QUEUE FOR EVENT'; }

            // toggle classes
            angular.element('.stages').toggleClass('confirm');
            angular.element('.confirmation').toggleClass('confirm');
            angular.element('.queue-modal-header').toggleClass('confirm');
            angular.element('.queue-modal-title').toggleClass('confirm');

        };

        // convert string to html
        self.to_html = function(html) {
            return $sce.trustAsHtml(html);
        };

        self.toggle_activity = function(activity) {
            if (activity === 'active') {
                if (!self.active) { self.both = false; }
            }
            if (activity === 'social') {
                if (!self.social) { self.both = false; }
            }
            if (activity === 'both') {
                if (self.both) {
                    self.active = true;
                    self.social = true;
                } else {
                    self.active = false;
                    self.social = false;
                }
            }
        };

        // initialize datetime picker
        self.init_datetimepicker = function() {
            if (self.datetime) {
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
        self.get_full_date = function(unformatted_date) {
            var days_of_week = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var new_date = new Date(unformatted_date).getDay(),
                day_of_week = days_of_week[new_date];

            return day_of_week + ', ' + unformatted_date;
        };

        self.get_formatted_time = function(time) {
            if (!time) { return; }
            if (time.charAt(0) === '0') { return time.substring(1); }
            return time;
        };

        self.get_location = function(location_id) {
            var list_of_locations;
            for (var i = 0; i < self.steps.length; i++) {
                if (self.steps[i].stage === 'location_pref') {
                    list_of_locations = self.steps[i].locations;
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

        self.add_errors = function(type, selector, message) {
            var error = angular.element('div[type="' + type + '"]');

            error.html(message);
            if (type !== 'activity_type') {
                angular.element(selector).addClass('queue-input-error');
            }
        };

        self.clear_errors = function(element) {
            if (element === 'all') {
                angular.element('.queue-errors').html('');
                angular.element('.queue-input-error').removeClass('queue-input-error');
            }
        };

        /* Here we go */
        self.init();
    }

})();
