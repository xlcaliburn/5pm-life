'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($http, $timeout) {
        var self = this;

        // global variables
        self.email;
        self.form;
        self.loading;
        self.status = angular.element('.login-status');
        self.submit_button = angular.element('.submit-button');
        self.section_container = angular.element('.login-section');

        // submit email for verification
        self.submit = function() {
            clear_errors();

            // update front end
            self.submit_button.addClass("loading");
            self.loading = true;

            var legit_email = validate_email();

            if (legit_email)
                submit_email();
            else
                notify_error();
        }

        // validate email address
        function validate_email() {
            if (!self.form.$valid || self.form.$pristine || !self.email)
                return false;
            return true;
        }

        // save email address in db
        function submit_email() {

            // do $http request to save email

            // update front end

            $timeout(function() {
                self.section_container.addClass("status-ok");
                self.status.addClass("teal");
                self.status.html('Thank you for signing up. We\'ll notify you when the BETA is ready!');
                self.loading = false;
            }, 1000);
        }

        // notify errors on invalid email
        function notify_error() {
            $timeout(function() {
                self.submit_button.removeClass("loading");
                self.status.addClass("invalid");
                self.status.html('Please enter a valid email address.');
                self.loading = false;
            }, 1000);
        }

        // clear errors on submit
        function clear_errors() {
            self.status.removeClass("invalid");
            self.status.html('');
        }

    }

})();
