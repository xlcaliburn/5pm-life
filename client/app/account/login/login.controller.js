'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(Auth, $state) {
        var vm = this;

        vm.email_address;
        vm.password;
        vm.remember_login = false;
        vm.status = "";
        vm.Auth = Auth;

        // try submitting form
        vm.login = function() {
            vm.status = "";
            var status = vm.validate_inputs();

            // has errors
            if (!status)
                vm.submit_login();
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
            vm.Auth.login({
                email: vm.email_address,
                password: vm.password
            }).then(() => {
                // Logged in, redirect to home
                window.location.href = "/home";
            }).catch(err => {
                vm.status = "Incorrect username/password combination";
            });
        }

        // helper function for validating email address
        function valid_email() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(vm.email_address);
        }

    }

})();
