'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('EventController', EventController);

    /** @ngInject */
    /*global google */
    /* jshint expr: true */
    function EventController($cookies, $timeout, NavbarService, event_data) {

        var vm = this;

        // model
        vm.event_data = event_data;
        console.log(vm.event_data);
        vm.carousel = [
            { src: 'assets/images/carousel/stock-1.jpg' },
            { src: 'assets/images/carousel/stock-2.jpg' },
            { src: 'assets/images/carousel/stock-3.jpg' },
            { src: 'assets/images/carousel/stock-4.jpg' },
            { src: 'assets/images/carousel/stock-5.jpg' },
            { src: 'assets/images/carousel/stock-6.jpg' }
        ];
        vm.venue = {
            name: 'Pillow Fight',
            venue: 'Nathan Phillip\'s Square',
            date: 'Tuesday, July, 2016',
            time: '3:00 pm',
            location: '100 Queen St W\nToronto, ON\nM5H 2N2',
            lat_lng: '43.653488, -79.383962'
        };
        vm.attendees = [
            {
                name: 'Henry Klay',
                thumb: 'assets/images/attendees/klay-thumb.png',
                props: ['Designer', 'Developer', 'Playboy']
            },
            {
                name: 'Cecelia Hei',
                thumb: 'assets/images/attendees/hei-thumb.png',
                props: ['Model', 'Actress', 'Developer']
            },
            {
                name: 'Scott Helms',
                thumb: 'assets/images/attendees/helms-thumb.png',
                props: ['Skater', 'Gamer', 'Creative Designer']
            },
            {
                name: 'Jennifer Grey',
                thumb: 'assets/images/attendees/grey-thumb.png',
                props: ['Drama Queen', 'Jesus Lover', 'vmie-taker']
            },
            {
                name: 'Monica Wells',
                thumb: 'assets/images/attendees/wells-thumb.png',
                props: ['Fashion Artist', 'Photographer', 'Wedding Planner']
            },
            {
                name: 'Michael Wong',
                thumb: 'assets/images/attendees/wong-thumb.png',
                props: ['Computer Scientist', 'Realist', 'Gamer']
            },
        ];
        vm.chat_messages = [
            {
                name: 'Jennifer Grey', colour: '#2ab9bb',
                thumb: 'assets/images/attendees/grey-thumb.png',
                text: 'Hey guys! I can’t wait for this event to go down!'
            },
            {
                name: 'Cecelia Hei', colour: '#7d619c',
                thumb: 'assets/images/attendees/hei-thumb.png',
                text: 'lol, what a weird event... a pillow fight? I’ve never been to that before xD'
            },
            {
                name: 'Henry Klay', colour: '#ff7241',
                thumb: 'assets/images/attendees/klay-thumb.png',
                text: 'yoo, i’ve been to this event before. wanna get drinks after? I know a great place nearby'
            },
            {
                name: 'Scott Helms', colour: '#196ea5',
                thumb: 'assets/images/attendees/helms-thumb.png',
                text: 'i’ll have to check my schedule but it should be okay. i live nearby anyway so you guys can come chill afterwards'
            },
            {
                name: 'Monica Wells', colour: '#e43c5c',
                thumb: 'assets/images/attendees/wells-thumb.png',
                text: 'ooo sounds great guys!'
            },
        ];
        vm.status = 'attend';

        // views
        vm.image_container = angular.element('.current-image');
        vm.image_list = angular.element('.image-list');
        vm.map;
        vm.chatbox = angular.element('#chat-box');
        vm.textarea;

        // variables
        vm.lat;
        vm.lng;

        vm.init = function() {
            // setup initial image first
            vm.image_container.css('background-image', 'url("' + vm.carousel[0].src + '")');
            $timeout(function() {
                angular.element('.image-0').addClass('image-selected');
            });

            // set image list width
            var width = (vm.carousel.length * 160) + 30;
            vm.image_list.css('width', width);
            vm.init_map();

            // setup chat
            $timeout(function() { vm.chatbox.scrollTop(vm.chatbox[0].scrollHeight);});
        };

        vm.init_map = function() {
            // get lat and lng
            var coords = vm.venue.lat_lng.split(',');
            vm.lat = parseFloat(coords[0]);
            vm.lng = parseFloat(coords[1]);

            var myOptions = {
                zoom: 14,
                center: {lat: vm.lat, lng: vm.lng},
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            vm.map = new google.maps.Map(document.getElementById('event-map'), {
                center: {lat: vm.lat, lng: vm.lng},
                zoom: 14,
                options: myOptions
            });

            new google.maps.Marker({
                position: {lat: vm.lat, lng: vm.lng},
                map: vm.map,
                title: vm.venue.venue
            });
        };

        vm.display_props = function(prop_list) {
            var prop_string = '';
            for (var i = 0; i < prop_list.length; i++) {
                if (i !== 0) {
                    prop_string += ' . ';
                }
                prop_string += prop_list[i];
            }
            return prop_string;
        };

        vm.send_message = function(event) {
            if (event.shiftKey) { return false; }

            event.preventDefault();
            if (!vm.textarea || vm.textarea.trim() === '') {
                return false;
            }
            var user = 'Michael Wong',
                message = vm.textarea.trim();
            vm.textarea = '';

            if (vm.chat_messages[vm.chat_messages.length - 1].name === user) {
                vm.chat_messages[vm.chat_messages.length -1].text += '\n' + message;
            } else {
                message = {
                    name: user, colour: '#000000',
                    thumb: 'assets/images/attendees/wong-thumb.png',
                    text: message
                };
                vm.chat_messages.push(message);
            }

            // append message
            $timeout(function() {
                vm.chatbox.scrollTop(vm.chatbox[0].scrollHeight);
            });

            return true;
        };

        vm.change_image = function(event, image_path) {
            angular.element('.image-selected').removeClass('image-selected');
            angular.element(event.currentTarget).addClass('image-selected');
            vm.image_container.css('background-image', 'url("' + image_path + '")');
        };

        vm.get_background = function(image_path) {
            return {
                'background-image': 'url(' + image_path + ')'
            };
        };

        vm.toggle_dropdown = function() {
            angular.element('.dropdown-content').toggleClass('active');
        };

        vm.select_status = function(status) {
            vm.status = status;
            vm.toggle_dropdown();
        };

        vm.init();
    }

})();
