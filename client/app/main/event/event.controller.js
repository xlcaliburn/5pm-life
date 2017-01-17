'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('EventController', EventController);

    function EventController($cookies, $rootScope, $scope, $state, $stateParams, $timeout, $window, event_data, EventService, socket) {
        var vm = this;

        vm.event_data = event_data;
        vm.attendees = null;
        vm.chat_messages = [];
        vm.message_input = '';
        vm.confirm_event = confirmEvent;
        vm.decline_event = declineEvent;
        //vm.get_confirmed_attendees = getConfirmedAttendees;
        vm.confirmed = [];
        vm.get_event_date = function(date) { return moment(date).format('dddd, MMMM D, YYYY'); };
        vm.get_event_time = function() { return moment(vm.event_data.dt_start).format('h:mmA') + ' to ' + moment(vm.event_data.dt_end).format('h:mmA'); };
        vm.get_googlemaps_link = function() { return 'http://maps.google.com/?q=' + vm.event_data.venue.venue_name + ',' + vm.event_data.venue.address.city; };
        vm.hide_navbar = hideNavbar;
        vm.leave_event = leaveEvent;
        vm.get_profile_img = function(image_name) { return image_name; };
        vm.open_leave_modal = function() { angular.element('#leave-modal').openModal(); };
        vm.resize_map = resizeMap;
        vm.scroll_chatbox = scrollChatbox;
        vm.send_message = sendMessage;
        vm.view_attendees = function() { event.currentTarget.click(); };

        var map, mobile_gmap, marker, mobile_marker, infowindow, mobile_infowindow;
        var eventSocket;
        var eventRoom = $stateParams.id;
        var chatbox, chatbox_mobile;
        var textarea;
        var just_confirmed = false;
        var focus_timeout;

        $scope.$on('$destroy', destroy);

        init();

        function init() {
            $rootScope.title = vm.event_data.activity.activity_name + ' at ' + vm.event_data.venue.venue_name;

            console.log(vm.event_data);
            // remove bg
            angular.element('body').addClass('event');
            angular.element('.wrap').addClass('event');
            angular.element('body').addClass('gmap');

            // leave modal
            $timeout(function() { angular.element('.modal-trigger').leanModal(); });

            setConfirmedAttendees();
            getLatLng();
            getSelfStatus(true);
            initPlugins();
        }

        // auto resize textarea based on height
        function autosize() {
            setTimeout(function(){
                textarea.css('height', 'auto');
                textarea.css('height', textarea.prop('scrollHeight') + 'px');
            },0);
        }

        // make chat look pretty
        function beautifyChatMessages() {
            var beautiful_chat_messages = [];
            var message = vm.chat_messages[0];
            var buffer = vm.chat_messages[0].message;

            for (var i = 1; i < vm.chat_messages.length; i++) {
                if (vm.chat_messages[i].user._id === message.user._id) {
                    // append current message to  the end of the previous message
                    buffer += '\n' + vm.chat_messages[i].message;
                } else {
                    // on person change
                    message.message = buffer;
                    beautiful_chat_messages.push(message);
                    message = vm.chat_messages[i];
                    buffer = vm.chat_messages[i].message;
                }
            }

            if (buffer !== '') {
                message.message = buffer;
                beautiful_chat_messages.push(message);
            }
            vm.chat_messages = beautiful_chat_messages;
        }

        // confirm event confirmation
        function confirmEvent() {
            EventService.confirmEvent(vm.event_data)
                .then(() => {
                    just_confirmed = true;
                    getSelfStatus(true);
                    new PNotify({
                        title: 'Event',
                        text: 'You have accepted the invitation!',
                        type: 'success'
                    });
                    $timeout(function() {
                        angular.element('.tooltipped').off('mouseenter mouseleave');
                    }, 50);
                })
            ;
        }

        // decline event confirmation
        function declineEvent() {
            EventService.declineEvent(vm.event_data)
                .then(()=> {
                    $state.go('home');
                    new PNotify({
                        title: 'Decline Event',
                        text: 'You have declined the event and will be placed back into queue.',
                        type: 'info',
                        delay: 8000
                    });
                })
                .catch(function() {
                    $state.go('home');
                })
            ;
        }

        // revert everything back to before event
        function destroy() {
            // re-eanble bg
            hideNavbar(false);
            angular.element('body').removeClass('event');
            angular.element('.wrap').removeClass('event');
            angular.element('.footer').css('display', 'block');
            angular.element('.mobile-navbar').removeClass('no-shadow');
        }

        // get latitude and longitude based on event address
        function getLatLng() {
            var venue_address = vm.event_data.venue.address;
            var geocoder = new google.maps.Geocoder();
            var address = venue_address.street + ', ' + venue_address.city + ', ' + venue_address.province;

            geocoder.geocode({ 'address': address }, function(res, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    initMap(res[0].geometry.location.lat(), res[0].geometry.location.lng());
                }
            });
        }

        // init google maps using coordinates from address
        function initMap(lat, lng) {
            var draggable = ($window.innerWidth > 768);
            var myOptions = {
                zoom: 14,
                center: {lat: lat, lng: lng},
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: draggable,
                scrollwheel: false,
                disableDoubleClickZoom: true
            };

            if (draggable) {
                // desktop
                angular.element('body').removeClass('gmap');
                map = new google.maps.Map(document.getElementById('event-gmap'), {
                    center: {lat: lat, lng: lng},
                    zoom: 14,
                    options: myOptions
                });

                infowindow = new google.maps.InfoWindow({ content : vm.event_data.venue.venue_name });
                marker = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: map,
                    title: vm.event_data.venue.venue_name
                });

                marker.addListener('click', function() {
                    if (infowindow) { infowindow.close(); }
                    infowindow.open(map, marker);
                });
            } else {
                // mobile
                mobile_gmap = new google.maps.Map(document.getElementById('mobile-event-gmap'), {
                    center: {lat: lat, lng: lng},
                    zoom: 12,
                    options: myOptions
                });

                mobile_infowindow = new google.maps.InfoWindow({ content: vm.event_data.venue.venue_name });
                mobile_marker = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: mobile_gmap,
                    title: vm.event_data.venue.venue_name
                });

                mobile_marker.addListener('click', function() {
                    if (mobile_infowindow) { mobile_infowindow.close(); }
                    mobile_infowindow.open(mobile_gmap, mobile_marker);
                });

                // fix for mobile google maps
                google.maps.event.addListenerOnce(mobile_gmap, 'idle', function() {
                    angular.element('body').removeClass('gmap');
                    google.maps.event.trigger(mobile_gmap, 'resize');
                    mobile_gmap.setCenter(new google.maps.LatLng(lat, lng));
                });
            }
        }

        // returns your status
        function getSelfStatus(new_data) {
            if (new_data) {
                return EventService.getEventAttendees(vm.event_data._id).then(function(res) {
                    if (res.data.response.status === 'ok') {
                        vm.attendees = res.data.response.attendees;
                        for (var i = 0; i < vm.attendees.length; i++) {
                            if (vm.attendees[i].status) {
                                 vm.user_status = vm.attendees[i].status;
                                 if (vm.user_status === 'Confirmed') {
                                     initSockets();
                                     angular.element('.modal-trigger').leanModal();
                                     $timeout(scrollChatbox);
                                 }
                                 return;
                            }
                        }
                    } else {
                        $state.go('home');
                    }
                });
            } else {
                for (var i = 0; i < vm.attendees.length; i++) {
                    if (vm.attendees[i].status) {
                         vm.user_status = vm.attendees[i].status;
                         return;
                    }
                }
            }
        }

        // gets list of confirmed attendees
        function setConfirmedAttendees() {
            var attendees_array = [];
            for (var i = 0; i < vm.event_data.users.length; i++) {
                //if (!vm.attendees[i].status || vm.attendees[i].status === 'Confirmed') {
                    attendees_array.push({
                        name : vm.event_data.users[i].first_name + ' ' + vm.event_data.users[i].last_name,
                        adjectives : vm.event_data.users[i].adjectives,
                        profile_picture : vm.event_data.users[i].profile_picture.current
                    });
                //}
            }
            vm.confirmed = attendees_array;
        }

        // init materialize plugins
        function initPlugins() {
            // tooltips
            $timeout(function() {
                angular.element('i[data-tooltip]').tooltip();
                angular.element('.tooltipped').tooltip();
                angular.element('ul.tabs').tabs();
                angular.element('.footer').css('display', 'none');
            }, 500);
        }

        // leave event because they cannot make it
        function leaveEvent() {
            $timeout(function() {
                var event_details = {};
                event_details.id = vm.event_data._id;

                EventService.leaveEvent(event_details).then(function(res) {
                    if (res.status === 204) {
                        $state.go('home');
                        new PNotify({
                            title: 'Leave Event',
                            text: 'You have left the event',
                            type: 'success'
                        });
                        eventSocket.emit('leave_event', eventRoom);
                        eventSocket = null;
                        eventRoom = null;

                        // reset navbar search settings
                        $rootScope.$emit('reset_queue');
                    }
                }).catch(function() { $state.go('home'); });
            }, 300);
        }

        // initialize sockets;
        function initSockets() {
            if (vm.user_status === 'Confirmed') {
                eventSocket = socket.socket;

                eventSocket.emit('join_event', eventRoom);

                // fetch chat
                eventSocket.on('fetch_chat', function() {
                    EventService.fetchEventChat(eventRoom).then(function(res) {
                        vm.chat_messages = res.messages;

                        beautifyChatMessages();
                        $timeout(scrollChatbox, 50);
                    });
                });

                eventSocket.on('receive_message', function(message) {
                    receiveMessage(message);
                });

                eventSocket.on('user_join_leave', function(data) {
                    EventService.getEventAttendees(eventRoom).then(function(res) {
                        vm.attendees = res.data.response.attendees;
                    });

                    // send person has joined event
                    var status_msg = (data.status === 'join' ? 'has joined the event!' : 'has left the event');
                    var chat_message = {
                        user: data.user,
                        message: status_msg,
                        status: data.status
                    };
                    vm.chat_messages.push(chat_message);
                    scrollChatbox();
                });

                eventSocket.on('message_error', function() {
                    window.location.href = '/logout';
                });

                $timeout(function() {
                    // init textarea
                     textarea = angular.element('#message-input');
                     textarea.on('keydown', autosize);
                });

                // if just confirmed, let everyone know
                if (just_confirmed) {
                    just_confirmed = false;
                    eventSocket.emit('confirm_event', eventRoom);
                }
            }
        }

        // receive message from server
        function receiveMessage(message) {
            var message_text = message.message.trim().replace(/ +/g, ' ');
            if (!message) { return; }
            var chat_message = {
                message: message_text,
                user: message.user
            };

            if (vm.chat_messages.length > 0) {
                // check to see if it's the same person typing the message
                if (vm.chat_messages[vm.chat_messages.length - 1].user._id === message.user._id) {
                    // append to end of message
                    vm.chat_messages[vm.chat_messages.length - 1].message += '\n' + message_text;
                } else {
                    vm.chat_messages.push(chat_message);
                }
            } else {
                vm.chat_messages.push(chat_message);
            }

            scrollChatbox();
        }

        // resize google maps on details page
        function resizeMap(event) {
            event.currentTarget.click();
            $timeout(function() {
                if (mobile_gmap) {
                    google.maps.event.trigger(mobile_gmap, 'resize');
                }
            });
        }

        // send chat message
        function sendMessage(event) {
            document.getElementById('message-input').focus();
            $timeout.cancel(focus_timeout);
            if (event.shiftKey) { return false; }

            event.preventDefault();

            if (!vm.message_input || vm.message_input.trim() === '') {
                return false;
            }

            var data = {
                event_id: eventRoom,
                message: vm.message_input
            };

            eventSocket.emit('send_message', data);
            vm.message_input = '';
        }

        // toggle navbar based on if chat input is focused
        function hideNavbar(hide) {
            if (hide) { // ngFocus
                angular.element('.mobile-navbar').addClass('focus');
                angular.element('.wrap').addClass('focus');
                //angular.element('.mobile-chat-area').css('max-height', '100%');
                scrollChatbox(400);
            } else { //ngBlur
                focus_timeout = $timeout(function() {
                    if (angular.element('.mobile-event-tabs').is(':visible')) {
                        angular.element('.mobile-navbar').removeClass('focus');
                    }
                    angular.element('.wrap').removeClass('focus');
                    angular.element('.mobile-chat-area').css('max-height', 'calc(100% - 65px)');
                    if (chatbox) {
                        chatbox.scrollTop(chatbox.prop('scrollHeight'));
                    } else if (chatbox_mobile) {
                        chatbox_mobile.scrollTop(chatbox_mobile.prop('scrollHeight'));
                    }
                });
            }
        }

        // scroll chatbox to bottom
        function scrollChatbox(time) {
            var delay = time || 0;
            $timeout(function() {
                if (!chatbox) {
                    chatbox = angular.element('.chat-area');
                }

                if (!chatbox_mobile) {
                    chatbox_mobile = angular.element('.mobile-chat-area');
                }
                chatbox.scrollTop(chatbox.prop('scrollHeight'));
                chatbox_mobile.scrollTop(chatbox_mobile.prop('scrollHeight'));
            }, delay);
        }
    }
})();
