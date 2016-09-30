'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    /* jshint expr: true */
    function ResetPasswordController($stateParams, $timeout, loading_spinner, PasswordResetService) {
        var vm = this;

        // view
        vm.password;
        vm.confirm_password;

        // variables
        vm.user_id = $stateParams.id;
        vm.status;
        vm.error_message;
        vm.verified = false;
        vm.authorized = true;

        // function headers
        vm.init = init;
        vm.reset_password = reset_password;

        /* class functions
        *************************************************/
        function init() {
            // validate user_id
            var data = {
                id: vm.user_id
            };

            PasswordResetService.validateUser(data).then(function(res) {
                var response = res.data.response;
                if (response.status) {
                    vm.status = response.status;
                    if (vm.status === 'unauthorized') {
                        vm.error_message = 'You are not authorized to change your password at this time.';
                        vm.authorized = false;
                    }
                }
            });
        }

        // reset password
        function reset_password() {
            vm.error_message = '';
            vm.status = '';

            var reset_button = angular.element('.reset-password-button');
            reset_button.html(loading_spinner);
            reset_button.attr('disabled', 'disabled');

            var data = {
                id: vm.user_id,
                password: vm.password,
                confirm_password: vm.confirm_password
            };

            // submit the data
            PasswordResetService.changePassword(data).then(function(res) {
                var response = res.data.response;
                vm.status = response.status;
                if (response.status === 'ok') {
                    vm.verified = true;
                    return;
                } else if (response.status === 'empty_password') {
                    vm.error_message = 'Please enter your new password.';
                } else if (response.status === 'unauthorized') {
                    vm.error_message = 'You are not authorized to change your password at this time.';
                    vm.authorized = false;
                } else if (response.status === 'password_mismatch') {
                    vm.error_message = 'Your password does not match';
                } else if (response.status === 'short_password') {
                    vm.error_message = 'Your password must be at least 8 characters long.';
                } else {
                    vm.error_message = 'You are not authorized to change your password at this time.';
                    vm.authorized = false;
                }

                reset_button.html('RESET PASSWORD');
            });

        }

        vm.init();
    }
})();
