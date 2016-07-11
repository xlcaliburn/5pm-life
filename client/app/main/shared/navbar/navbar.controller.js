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
                stage: 'datetime',
                title: "date and time",
                subtitle: "Select a date and time of when you are available",
                tooltip: "Enter tooltip here"
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

        /*======================================
            Functions
        =======================================*/
        self.init = function() {
            // init datetime picker
            self.init_datetimepicker();
        }

        // open modal when explore is clicked
        self.open_queue_modal = function() {
            if (self.modal_open)
                return;

            self.modal.css('display', 'block');
            self.body.addClass('modal-open');
            self.modal_open = true;
        }

        // close modal when overlay is clicked
        self.close_queue_modal = function() {
            if (!self.modal_open)
                return;

            self.modal.css('display', 'none');
            self.body.removeClass('modal-open');
            self.modal_open = false;
        }

        // convert string to html
        self.to_html = function(html) {
            return $sce.trustAsHtml(html);
        }

        // initialize datetime picker
        self.init_datetimepicker = function() {
            if (self.datetime) {
                $timeout(function() {
                    var datepicker = angular.element("#datepicker");
                    datepicker.pickadate({
                        format: 'mmmm dd, yyyy'
                    });
                });
            }
        }

        /* Here we go */
        self.init();
    }

})();
