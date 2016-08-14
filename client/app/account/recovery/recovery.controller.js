'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('RecoveryController', RecoveryController);

    /** @ngInject */
    /* jshint expr: true */
    function RecoveryController($timeout, loading_spinner, RecoveryService) {
        var vm = this;

        // view
        vm.email_address;

        // variables
        vm.error_message;

        // function headers
        vm.validate_email = validate_email;
        vm.reset_password = reset_password;
        vm.verified = false;

        /* class functions
        *************************************************/
        // validate_email address
        function validate_email() {
            if (!valid_email(vm.email_address)) {
                vm.error_message = 'Please enter a valid email address';
                return;
            }
            reset_password();
        }

        // reset password
        function reset_password() {
            var reset_button = angular.element('.reset-password-button');
            reset_button.html(loading_spinner);
            reset_button.attr('disabled', 'disabled');
            var data = {
                email_address: vm.email_address
            };

            RecoveryService.resetPassword(data).then(function(res) {
                reset_button.html('RESET PASSWORD');
                reset_button.attr('disabled', '');

                var res_data = res.data.response;
                if (res_data.status == 'error') {
                    vm.error_message = res_data.error_message;
                } else if (res_data.status == 'ok') {
                    vm.verified = true;
                }
            });
        }

        /* helper functions
        *************************************************/
        // validate email address
        function valid_email(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }
})();
