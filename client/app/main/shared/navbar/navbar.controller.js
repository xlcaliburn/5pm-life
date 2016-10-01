'use strict';

(function() {

    angular
    .module('fivepmApp')
    .controller('NavbarController', NavbarController);

    function NavbarController($cookies, $rootScope, $sce, $scope, $state, $timeout, $window, NavbarService, socket, Users) {

        /* jshint expr: true */
        var vm = this;
        vm.user = {};

        // model
        vm.steps = [
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
                        city: 'Toronto'
                    }
                ]
            }
        ];

        // views
        vm.body = angular.element('body');
        vm.overlay = angular.element('.queue-modal-overlay');
        vm.modal = angular.element('#queue-modal');
        vm.datetime = angular.element('.datetime-stage');
        vm.event_link;
        vm.event;
        vm.on_event_page = false;
        vm.current_stage = 1;
        vm.next_or_queue = 'NEXT';

        // variables
        vm.queue_status;
        vm.status_title = 'QUEUE FOR EVENT';
        vm.nav_open = false;
        vm.modal_open = false;
        vm.queue_date;
        vm.queue_start_time;
        vm.queue_end_time;
        vm.active = false;
        vm.social = false;
        vm.both = false;
        vm.confirm = false;
        vm.mobile_nav_open = false;
        vm.location;
        vm.toggle_mobile_nav = toggleMobileNav;
        vm.get_queue_status = get_queue_status;
        vm.prev_stage = prevStage;
        vm.next_stage = nextStage;
        vm.get_current_statename = getCurrentStateName;
        var eventSocket;

        /*======================================
            Functions
        =======================================*/
        init();

        function init() {
            get_queue_status();

            updateUserInfo();
            // detect when user info needs to be updated
            $scope.$on('updateUser', updateUserInfo);

            // init datetime picker
            init_datetimepicker();

            // reset queue parameters when necessary
            $rootScope.$on('reset_queue_search', reset_queue.bind(vm));

            $timeout(function() {
                var tooltips = angular.element('.queue-tooltip');
                tooltips.tooltip({delay: 0});
            });
        }

        // get user's queue status
        function get_queue_status() {
            var token = $cookies.get('token');
            if (!token) { window.location.href = '/logout'; }

            NavbarService.getUserQueueStatus(token).then(function(res) {

                var queue_status = res.data.response.queue_status;
                var event_link = res.data.response.event_link;
                var event = res.data.response.event;
                var prev_queue_status = vm.queue_status;
                vm.queue_status = queue_status;
                console.log(res.data);
                if (event_link) {
                    vm.event_link = event_link;
                }

                if (event) {
                    vm.event = event;
                }

                if (!vm.queue_status) {
                    vm.queue_status = -1;
                }

                if ($state.current.name === 'home.event') {
                    vm.on_event_page = true;
                }

                if (prev_queue_status === 'Pending' && vm.queue_status === 'Pending User Confirmation') {
                    // open modal
                    angular.element('#event-found-modal').openModal();
                }

                $timeout(function() {
                    var modals = angular.element('.modal-trigger');
                    modals.leanModal({
                        dismissible: true,
                        opacity: 0.5,
                        starting_top: '4%',
                        ending_top: '10%'
                    });
                });

                if (vm.queue_status) {
                    initSockets();
                }
            })
            .catch(function() {
                window.location.href = '/logout';
            });
        }

        function initSockets() {
            if (!eventSocket) {
                eventSocket = socket.socket;
                eventSocket.emit('join');
                eventSocket.on('update_status', function() {
                    get_queue_status();
                });
                eventSocket.on('message_error', function() {
                    window.location.href = '/logout';
                });
            }
        }

        function nextStage() {
            clear_errors('all');
            var invalid_stage = validateStage(vm.current_stage);

            if (!invalid_stage) {
                if (vm.current_stage < 4) {
                    vm.current_stage++;
                    angular.element('#queue-step-' + vm.current_stage).tab('show');
                }

                if (vm.current_stage === 4) {
                    vm.next_or_queue = 'QUEUE';
                    vm.confirm_queue();
                }
            }

            return;
        }

        function prevStage() {
            if (vm.current_stage > 1) {
                if (vm.current_stage === 4) {
                    vm.toggle_confirm_information();
                }
                vm.current_stage--;
                vm.next_or_queue = 'NEXT';
            }
            angular.element('#queue-step-' + vm.current_stage);
        }

        function validateStage(stage) {
            if (stage === 1) {
                return validateDatetime();
            } else if (stage === 2) {
                return validateActivity();
            } else if (stage === 3) {
                return validateLocation();
            } else {
                return validateDatetime() && validateActivity() && validateLocation();
            }
        }

        function validateDatetime() {
            /*================================================
            ================ validate date
            =================================================*/
            // check if date is empty
            if (!vm.queue_date) {
                vm.add_errors('datetime', '#datepicker', 'Please select a date below');
                return 1;
            }

            // check if date is valid
            var selected_date = new Date(vm.queue_date);
            if (selected_date === 'Invalid Date') {
                vm.add_errors('datetime', '#datepicker', 'Please enter a valid date');
                return 1;
            }

            // check if selected date is in the past
            var today = new Date(); today.setHours(0,0,0,0);
            if (selected_date < today) {
                vm.add_errors('datetime', '#datepicker', 'The date you have chosen is in the past');
                return 1;
            }

        /*================================================
        ================ validate time
        =================================================*/

            // check for empty inputs
            if (!vm.queue_start_time) {
                vm.add_errors('datetime', '.start-timepicker', 'Please select a starting time below');
                return 1;
            } else if (!vm.queue_end_time) {
                vm.add_errors('datetime', '.end-timepicker', 'Please select an ending time below');
                return 1;
            }

            // check if time between start and end is at least 3 hours and therefore start time must
            // be less than 9:00PM
            var start_time = parseInt(moment(vm.queue_start_time, ['h:mmA']).format('HHmm')),
                end_time = parseInt(moment(vm.queue_end_time, ['h:mmA']).format('HHmm')),
                modified_start_time = start_time + 300; // time with 3 hour gap

            if (start_time >= 2100) {
                vm.add_errors('datetime', '.start-timepicker', 'Please select an earlier start time');
                return 1;
            }

            if (modified_start_time > end_time) {
                vm.add_errors('datetime', '.start-timepicker', 'Your available time range needs to be at least 3 hours');
                vm.add_errors('datetime', '.end-timepicker', 'Your available time range needs to be at least 3 hours');
                return 1;
            }

            return false;
        }

        function validateActivity() {
            /*================================================
            == validate activity type
            =================================================*/
            // check if activity type is selected
            if (!vm.active && !vm.social) {
                vm.add_errors('activity_type', null, 'Please select an activity type');
                return 2;
            }

            return false;
        }

        function validateLocation() {
            /*================================================
            == validate location preference
            =================================================*/
            // check if activity type is selected
            if (!vm.location) {
                vm.add_errors('location_pref', '.location-select', 'Please select a location preference');
                return 3;
            }

            return false;
        }

        // open modal when explore is clicked
        vm.open_queue_modal = function() {
            if (vm.modal_open) { return; }

            vm.body.addClass('modal-open');
            vm.modal.addClass('queue-modal-open');
            vm.modal_open = true;
            materialize_select();
        };

        // close modal when overlay is clicked
        vm.close_queue_modal = function() {
            var date_modal_open = angular.element('#datepicker_root>.picker__holder').is(':visible');
            var time_modal_open = angular.element('.clockpicker').is(':visible');
            if (!vm.modal_open || date_modal_open || time_modal_open) { return; }

            vm.body.removeClass('modal-open');
            vm.modal.removeClass('queue-modal-open');
            vm.modal_open = false;
        };

        // reset queue so users can queue again
        function reset_queue() {
            if (vm.confirm) {
                vm.toggle_confirm_information();
            }
            vm.status_title = 'QUEUE FOR EVENT';
            vm.current_stage = 1;
            vm.nav_open = false;
            vm.modal_open = false;
            vm.queue_date = null;
            vm.queue_start_time = null;
            vm.queue_end_time = null;
            vm.active = false;
            vm.social = false;
            vm.both = false;
            vm.confirm = false;
            vm.location = null;
            angular.element('.picker__day--selected').removeClass('picker__day--selected');
        }

        vm.confirm_queue = function() {

            // if valid, go to confirmation page
            if (!vm.confirm) {
                vm.toggle_confirm_information();
            } else {
                vm.add_to_queue();
            }
        };

        // confirm information before submitting
        vm.toggle_confirm_information = function() {

            // change status and title
            vm.confirm = !vm.confirm;
            if (vm.confirm) { vm.status_title = 'CONFIRM EVENT PREFERENCES'; }
            else { vm.status_title = 'QUEUE FOR EVENT'; }

            // toggle classes
            /*angular.element('.stages').toggleClass('confirm');
            angular.element('.confirmation').toggleClass('confirm');*/
            angular.element('.queue-modal-header').toggleClass('confirm');
            angular.element('.queue-modal-title').toggleClass('confirm');
            //scroll_to('.queue-modal');
        };

        // add them to queue
        vm.add_to_queue = function() {
            //token
            var token = $cookies.get('token');

            // tags
            var tags = [];
            if (vm.social) { tags.push('social'); }
            if (vm.active) { tags.push('active'); }

            // event start
            var start_date_string = vm.queue_date + ' ' + get_time(vm.queue_start_time);
            var event_start = new Date(start_date_string);

            // event end
            var end_date_string = vm.queue_date + ' ' + get_time(vm.queue_end_time);
            var event_end = new Date(end_date_string);

            // city
            var city = vm.location;

            var queue_data = {
                token: token,
                tags: tags,
                event_start: event_start,
                event_end: event_end,
                city: city
            };
            NavbarService.addToQueue(queue_data).then(function(res) {
                var response = res.data.response;
                if (response.status === 'ok') {
                    vm.close_queue_modal();
                    Materialize.toast('You have been added to the queue!', 6000);
                    get_queue_status();
                } else {
                    Materialize.toast('Something went wrong', 6000);
                }
            });
        };

        // convert string to html
        vm.to_html = function(html) {
            return $sce.trustAsHtml(html);
        };

        vm.toggle_activity = function(activity) {
            if (activity === 'active') {
                if (!vm.active) { vm.both = false; }
            }
            if (activity === 'social') {
                if (!vm.social) { vm.both = false; }
            }
            if (activity === 'both') {
                if (vm.both) {
                    vm.active = true;
                    vm.social = true;
                } else {
                    vm.active = false;
                    vm.social = false;
                }
            }
        };

        // initialize datetime picker
        function init_datetimepicker() {
            if (vm.datetime) {
                $timeout(function() {
                    // init date
                    var datepicker = angular.element('#datepicker');
                    var yesterday = new Date((new Date()).valueOf()-1000*60*60*24);
                    datepicker.pickadate({
                        format: 'mmmm dd, yyyy',
                        disable: [
                          { from: [0,0,0], to: yesterday },
                          1,2,3,4,5,6
                        ],
                        onSet: function( arg ){
                            if ( 'select' in arg ){ //prevent closing on selecting month/year
                                this.close();
                            }
                        },
                        onClose: function() {
                            $('#datepicker_root>.picker__holder').hide();
                        },
                        onOpen: function() {
                            $('#datepicker_root>.picker__holder').show();
                            angular.element('.picker__today').remove();
                        }
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
        }

        // returns date with day of week
        vm.get_full_date = function(unformatted_date) {
            var days_of_week = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var new_date = new Date(unformatted_date).getDay(),
                day_of_week = days_of_week[new_date];

            return day_of_week + ', ' + unformatted_date;
        };

        vm.get_formatted_time = function(time) {
            if (!time) { return; }
            if (time.charAt(0) === '0') { return time.substring(1); }
            return time;
        };

        vm.get_location = function(location_id) {
            var list_of_locations;
            for (var i = 0; i < vm.steps.length; i++) {
                if (vm.steps[i].stage === 'location_pref') {
                    list_of_locations = vm.steps[i].locations;
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

        vm.add_errors = function(type, selector, message) {
            var error = angular.element('div[type="' + type + '"]');

            error.html(message);
            if (type !== 'activity_type') {
                angular.element(selector).addClass('queue-input-error');
            }
        };

        function clear_errors(element) {
            if (element === 'all') {
                angular.element('.queue-errors').html('');
                angular.element('.queue-input-error').removeClass('queue-input-error');
            }
        }

        // cancel_queue
        vm.cancel_queue = function() {
            var token = $cookies.get('token');
            if (!token) { $state.go('login'); }

            NavbarService.cancelUserQueue(token).then(function() {
                reset_queue();
                get_queue_status();
                Materialize.toast('Event search cancelled', 6000);
            })
            .catch(function() { $state.go('home'); });
        };

        function get_time(time_string) {
            // 09:00PM
            var hour = parseInt(time_string.substr(0,2));
            var minute = time_string.substr(3,2);
            var ampm = time_string.substr(5,2);

            if (ampm === 'PM') {
                hour += 12;
            }

            return hour + ':' + minute + ':00 EDT';
        }

        function toggleMobileNav() {
            vm.mobile_nav_open = !vm.mobile_nav_open;
            if (vm.mobile_nav_open) {
                angular.element('body').css('overflow', 'hidden');
            } else {
                angular.element('body').css('overflow', '');
            }
        }

        function getCurrentStateName() {
            return $state.current.name;
        }

        function updateUserInfo() {
            Users.getMe().success(function(data) {
                vm.user = data;
            });
        }

    }

})();
