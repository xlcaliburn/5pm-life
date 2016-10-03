'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('LoginController', LoginController);

    /** @ngInject */
    /* jshint expr: true */
    function LoginController($cookies, $state, Auth) {
        var vm = this;

        vm.email_address;
        vm.password;
        vm.remember_login = false;
        vm.status = '';
        vm.Auth = Auth;
        var page_redirect = $cookies.get('req_page');

        // try submitting form
        vm.login = function() {
            vm.status = '';
            var status = vm.validate_inputs();

            // has errors
            if (!status) {
                vm.submit_login();
            }
        };

        // validate email address and password
        vm.validate_inputs = function() {
            // empty email
            if (!vm.email_address) {
                vm.status = 'Please enter your email address.';
                return true;
            }

            // empty password
            if (!vm.password) {
                vm.status = 'Please enter your password.';
                return true;
            }

            // validate email address
            if (!valid_email()) {
                vm.status = 'Please enter a valid email address';
                return true;
            }

            // no errors
            return false;
        };

        // submit credentials to server
        vm.submit_login = function() {
            vm.Auth.login({
                email: vm.email_address,
                password: vm.password,
                remember: vm.remember_login
            }).then(() => {
                // Logged in, redirect to url or home
                if (page_redirect) {
                    $cookies.remove('req_page');
                    window.location.href = page_redirect;
                } else {
                    $state.go('home');
                }
            }).catch((err) => {
                console.log(err);
                vm.status = err.message;
            });
        };

        // helper function for validating email address
        function valid_email() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(vm.email_address);
        }

    }

})();
