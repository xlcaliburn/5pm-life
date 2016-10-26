'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('SignupController', SignupController);

    /** @ngInject */
    /* jshint expr: true */
    function SignupController($state, $timeout, loading_spinner, SignupService, enumsData, userData) {
        var vm = this;
        console.log(enumsData);
        // view
        vm.user = userData;
        vm.error_message;
        vm.first_name = userData.first_name;
        vm.last_name = userData.last_name;
        vm.birthday = {
            day: moment(userData.birthday).format('D'),
            month: moment(userData.birthday).format('MM'),
            year: moment(userData.birthday).format('YYYY')
        };
        vm.ethnicity;
        vm.gender;
        vm.email_address = userData.email;
        vm.steps = [
            {
                stage: 1,
                order_id: 1,
                key: 'first_name',
                value: 'first name',
                type: 'input'
            },
            {
                stage: 1,
                order_id: 2,
                key: 'last_name',
                value: 'last name',
                type: 'input'
            },
            {
                stage: 1,
                order_id: 3,
                key: 'birthday',
                value: 'birthday',
                type: 'date'
            },
            {
                stage: 2,
                order_id: 4,
                key: 'ethnicity',
                value: 'ethnicity',
                type: 'select',
                data: enumsData.ethnicity
            },
            {
                stage: 2,
                order_id: 5,
                key: 'gender',
                value: 'gender',
                type: 'select',
                data: enumsData.gender
            },
            {
                stage: 3,
                order_id: 6,
                key: 'email_address',
                value: 'email address',
                type: 'input'
            }
        ];

        //vm.age = moment().diff(moment('19900326', 'YYYYMMDD'), 'years');

        // variables
        vm.current_stage = 1;
        vm.completed_stages = [];

        // functions
        vm.init_jquery_elements = function() {

            // white background for this section
            angular.element('html').css('background-color','#ffffff');
            angular.element('body').css('background-color','#ffffff');
            $timeout(function() {
                angular.element('.tooltipped').tooltip({delay: 50});
            }, 500);
        };

        vm.get_days = function(days) {
            var day_array = [];
            for (var i = 1; i < days + 1; i++) {
                day_array.push(i);
            }
            return day_array;
        };

        // validating inputs
        vm.validate = function(full_validation) {
            vm.error_message = '';
            var i;

            if (vm.current_stage === 1 || full_validation) {
                // check for empty inputs
                if (!vm.first_name) { vm.error_message = 'Please enter your first name'; }
                else if (!vm.last_name) { vm.error_message = 'Please enter your last name'; }
                else if (!vm.birthday.day) { vm.error_message = 'Please enter your birth day'; }
                else if (!vm.birthday.month) { vm.error_message = 'Please select your birth month'; }
                else if (!vm.birthday.year) { vm.error_message = 'Please enter your birth year'; }

                // check for correct date
                var valid_ranges = [
                    { type: 'day', min: 1, max: 31 },
                    { type: 'month', min:1, max: 12 },
                    { type: 'year', min: new Date().getFullYear() - 100, max: new Date().getFullYear() - 1 }
                ];

                for (i = 0; i < valid_ranges.length; i++) {
                    var birth_date = parseInt(vm.birthday[valid_ranges[i].type]);
                    if (birth_date < valid_ranges[i].min || birth_date > valid_ranges[i].max) {
                        vm.error_message = 'Please enter a valid birthday ' + valid_ranges[i].type;
                    }
                }

                // return if there are any errors
                if (vm.error_message) {
                    vm.go_to_stage(1, true);
                    return;
                }
            }

            if (vm.current_stage === 2 || full_validation) {
                // check for blank inputs
                if (!vm.ethnicity) { vm.error_message = 'Please select an ethnicity';}
                else if (!vm.gender) { vm.error_message = 'Please select a gender'; }
                for (i = 0; i < vm.steps.length; i++) {
                    if (vm.steps[i].value === 'ethnicity') {
                        if (!enumsData.ethnicity[vm.ethnicity]) {
                            vm.error_message = 'Please select an ethnicity';
                            break;
                        }
                    }
                }
                for (i = 0; i < vm.steps.length; i++) {
                    if (vm.steps[i].value === 'gender') {
                        if (!enumsData.gender[vm.gender]) {
                            vm.error_message = 'Please select a gender';
                            break;
                        }
                    }
                }

                // return if there are any errors
                if (vm.error_message) {
                    vm.go_to_stage(2, true);
                    return;
                }
            }

            if (vm.current_stage === 3 || full_validation) {
                // blank inputs
                if (!vm.email_address) { vm.error_message = 'Please enter an email address'; }

                // invalid email address
                else if (!valid_email(vm.email_address)) {
                    vm.error_message = 'Please enter a valid email address';
                    $timeout(function() {
                        angular.element('input[stage="email_address"]').focus();
                    }, 300);
                }

                // return if there are any errors
                if (vm.error_message) {
                    vm.go_to_stage(3, true);
                    return;
                }
            }

            // proceed to next stage
            if (!full_validation) {
                if (vm.current_stage < 3) {
                    if (vm.completed_stages.indexOf(vm.current_stage) < 0) {
                        vm.completed_stages.push(vm.current_stage);
                    }
                    vm.current_stage++;
                    vm.go_to_stage(vm.current_stage);
                } else if (vm.current_stage === 3) {
                    // final front-end-validation
                    vm.validate(true);
                }
            } else {
                // make signup button unclickable and show loading
                var signup_button = angular.element('.signup-submit-button');
                signup_button.addClass('disabled');
                signup_button.html(loading_spinner);

                // backend validation + submit
                var data = {};
                for (i = 0; i < vm.steps.length; i++) {
                    var key = vm.steps[i].key;
                    data[key] = vm[key];
                }

                data.email_address = data.email_address.toLowerCase();
                SignupService.submitSignup(data).then(function(res) {
                    var response = res.data.response;
                    if (response.status === 'ok') {
                        // good data
                        $timeout(function() {
                            angular.element('.fade-me-hard').addClass('invis');
                            $timeout(function() {
                                angular.element('a[href="#register-success"]').tab('show');
                                vm.current_stage = 4;
                            }, 500);
                            $timeout(function() {
                                angular.element('.fade-me-hard').removeClass('invis');
                            }, 1000);
                            $timeout(function() {
                                $state.go('home');
                            }, 10000);
                        }, 1000);
                    } else {
                        // bad data - they tampered with our js
                        if (response.error_message) {
                            vm.error_message = response.error_message;
                            vm.go_to_stage(response.stage, true);
                        }
                        signup_button.removeClass('disabled');
                        signup_button.html('SIGN UP');
                    }
                });
            }
        };

        vm.go_to_stage = function(stage, allow_error) {
            if (stage < 1 || stage > 3) { return; }

            if (!allow_error) { vm.error_message = ''; }

            vm.current_stage = stage;
            var tab_button;

            if (stage === 1) {
                tab_button = angular.element('a[href="#personal-information"]');
            } else if (stage === 2) {
                tab_button = angular.element('a[href="#personal-details"]');
            } else if (stage === 3) {
                tab_button = angular.element('a[href="#account-settings"]');
            }
            if (tab_button) {
                tab_button.parent().removeClass('disabled');
                tab_button.tab('show');
            }

            for (var i = 3; i > stage; i--) {
                angular.element('.step-' + i).addClass('disabled');
            }
        };

        // validate email address
        function valid_email(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        // here we go
        vm.init_jquery_elements();
    }

})();
