'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController() {
        var vm = this;

        vm.email_address;
        vm.password;
        vm.remember_login = false;
        vm.status = "";

        // try submitting form
        vm.login = function() {
            vm.status = "";
            var status = vm.validate_inputs();

            // has errors
            if (status) {

            } else {
                vm.submit_login();
            }
        }

        // validate email address and password
        vm.validate_inputs = function() {
            // empty email
            if (!vm.email_address) {
                vm.status = "Please enter your email address.";
                return true;
            }

            // empty password
            if (!vm.password) {
                vm.status = "Please enter your password.";
                return true;
            }

            // validate email address
            if (!valid_email()) {
                vm.status = "Please enter a valid email address";
                return true;
            }

            // no errors
            return false;
        }

        // submit credentials to server
        vm.submit_login = function() {
            console.log('Email:', vm.email_address, 'Pass:', vm.password, 'Checked:', vm.remember_login);
        }

        // helper function for validating email address
        function valid_email() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(vm.email_address);
        }

    }

})();
