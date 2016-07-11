'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController($sce, $timeout) {
        var self = this;

        // model
        self.steps = [
            {
                order: 1,
                stage: "datetime",
                title: "date and time",
                subtitle: "Select a date and time of when you are available.",
                tooltip: "Enter date and time tooltip here"
            },
            {
                order: 2,
                stage: "activity_type",
                title: "activity type",
                subtitle: "Select one or more <span style='color: #429fd9'>activity types</span> that you would like your event to be.",
                tooltip: "Enter activity preference tooltip here"
            },
            {
                order: 3,
                stage: "location_pref",
                title: "location preference",
                subtitle: "Select your preferred event location.",
                tooltip: "Enter location preference tooltip here",
                locations: [
                    {
                        id: 12345,
                        city: "Richmond Hill"
                    }
                ]
            }
        ];

        // views
        self.body = angular.element('body');
        self.overlay = angular.element('.queue-modal-overlay');
        self.modal = angular.element("#queue-modal");
        self.datetime = angular.element('.datetime-stage');

        // variables
        self.nav_open = false;
        self.modal_open = false;
        self.queue_date;
        self.queue_start_time;
        self.queue_end_time;
        self.active = false;
        self.social = false;
        self.both = false;
        self.location;

        /*======================================
            Functions
        =======================================*/
        self.init = function() {
            // init datetime picker
            self.init_datetimepicker();
            self.init_tooltips();
        }

        // initialiaze tooltips
        self.init_tooltips = function() {
            $timeout(function() {
                var tooltips = angular.element('.queue-tooltip');
                tooltips.tooltip();
            });
        }

        // open modal when explore is clicked
        self.open_queue_modal = function() {
            if (self.modal_open)
                return;

            self.body.addClass('modal-open');
            self.modal.addClass('queue-modal-open');
            self.modal_open = true;
        }

        // close modal when overlay is clicked
        self.close_queue_modal = function() {
            if (!self.modal_open)
                return;

            self.body.removeClass('modal-open');
            self.modal.removeClass('queue-modal-open');
            self.modal_open = false;
        }

        // convert string to html
        self.to_html = function(html) {
            return $sce.trustAsHtml(html);
        }

        self.toggle_activity = function(activity) {
            if (activity == 'active') {
                if (!self.active) self.both = false;
            }
            if (activity == 'social') {
                if (!self.social) self.both = false;
            }
            if (activity == 'both') {
                if (self.both) {
                    self.active = true;
                    self.social = true;
                } else {
                    self.active = false;
                    self.social = false;
                }
            }
        }

        // initialize datetime picker
        self.init_datetimepicker = function() {
            if (self.datetime) {
                $timeout(function() {
                    // init date
                    var datepicker = angular.element("#datepicker");
                    datepicker.pickadate({
                        format: 'mmmm dd, yyyy'
                    });

                    // init start time
                    var start_timepicker = angular.element("#start_timepicker");
                    start_timepicker.pickatime({
                        autoclose: true,
                        twelvehour: true
                    });

                    // init end time
                    var end_timepicker = angular.element("#end_timepicker");
                    end_timepicker.pickatime({
                        autoclose: true,
                        twelvehour: true
                    });
                });
            }
        }

        /* Here we go */
        self.init();
    }

})();
