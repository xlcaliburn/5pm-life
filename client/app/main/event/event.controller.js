'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('EventController', EventController);

    /** @ngInject */
    function EventController($timeout) {
        var self = this;

        // model
        self.carousel = [
            { src: "assets/images/carousel/stock-1.jpg" },
            { src: "assets/images/carousel/stock-2.jpg" },
            { src: "assets/images/carousel/stock-3.jpg" },
            { src: "assets/images/carousel/stock-4.jpg" },
            { src: "assets/images/carousel/stock-5.jpg" },
            { src: "assets/images/carousel/stock-6.jpg" }
        ];
        self.venue = {
            name: "Pillow Fight",
            venue: "Nathan Phillip's Square",
            date: "Tuesday, July, 2016",
            time: "3:00 pm",
            location: "100 Queen St W\nToronto, ON\nM5H 2N2",
            lat_lng: "43.653488, -79.383962"
        };
        self.attendees = [
            {
                name: "Henry Klay",
                thumb: "assets/images/attendees/klay-thumb.png",
                props: ["Designer", "Developer", "Playboy"]
            },
            {
                name: "Cecelia Hei",
                thumb: "assets/images/attendees/hei-thumb.png",
                props: ["Model", "Actress", "Developer"]
            },
            {
                name: "Scott Helms",
                thumb: "assets/images/attendees/helms-thumb.png",
                props: ["Skater", "Gamer", "Creative Designer"]
            },
            {
                name: "Jennifer Grey",
                thumb: "assets/images/attendees/grey-thumb.png",
                props: ["Drama Queen", "Jesus Lover", "Selfie-taker"]
            },
            {
                name: "Monica Wells",
                thumb: "assets/images/attendees/wells-thumb.png",
                props: ["Fashion Artist", "Photographer", "Wedding Planner"]
            },
            {
                name: "Michael Wong",
                thumb: "assets/images/attendees/wong-thumb.png",
                props: ["Computer Scientist", "Realist", "Gamer"]
            },
        ];
        self.chat_messages = [
            {
                name: "Jennifer Grey", colour: "#2ab9bb",
                thumb: "assets/images/attendees/grey-thumb.png",
                text: "Hey guys! I can’t wait for this event to go down!"
            },
            {
                name: "Cecelia Hei", colour: "#7d619c",
                thumb: "assets/images/attendees/hei-thumb.png",
                text: "lol, what a weird event... a pillow fight? I’ve never been to that before xD"
            },
            {
                name: "Henry Klay", colour: "#ff7241",
                thumb: "assets/images/attendees/klay-thumb.png",
                text: "yoo, i’ve been to this event before. wanna get drinks after? I know a great place nearby"
            },
            {
                name: "Scott Helms", colour: "#196ea5",
                thumb: "assets/images/attendees/helms-thumb.png",
                text: "i’ll have to check my schedule but it should be okay. i live nearby anyway so you guys can come chill afterwards"
            },
            {
                name: "Monica Wells", colour: "#e43c5c",
                thumb: "assets/images/attendees/wells-thumb.png",
                text: "ooo sounds great guys!"
            },
        ]
        self.status = 'attend';

        // views
        self.image_container = angular.element('.current-image');
        self.image_list = angular.element('.image-list');
        self.map;
        self.chatbox = angular.element('#chat-box');
        self.textarea;

        // variables
        self.lat;
        self.lng;

        self.init = function() {
            // setup initial image first
            self.image_container.css('background-image', 'url("' + self.carousel[0].src + '")');
            $timeout(function() { angular.element('.image-0').addClass('image-selected') });


            // set image list width
            var width = (self.carousel.length * 160) + 30;
            self.image_list.css('width', width);
            self.init_map();

            // setup chat
            $timeout(function() { self.chatbox.scrollTop(self.chatbox[0].scrollHeight);});
        }

        self.init_map = function() {
            // get lat and lng
            var coords = self.venue.lat_lng.split(",");
            self.lat = parseFloat(coords[0]);
            self.lng = parseFloat(coords[1]);

            var myOptions = {
                zoom: 14,
                center: {lat: self.lat, lng: self.lng},
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            }

            self.map = new google.maps.Map(document.getElementById('event-map'), {
                center: {lat: self.lat, lng: self.lng},
                zoom: 14
            });

            var marker = new google.maps.Marker({
                position: {lat: self.lat, lng: self.lng},
                map: self.map,
                title: self.venue.venue
            });
        }

        self.display_props = function(prop_list) {
            var prop_string = "";
            for (var i = 0; i < prop_list.length; i++) {
                if (i != 0) prop_string += " . ";
                prop_string += prop_list[i];
            }
            return prop_string;
        }

        self.send_message = function() {

            var user = "Michael Wong",
                message = self.textarea;

            if (self.chat_messages[self.chat_messages.length - 1].name == user) {
                self.chat_messages[self.chat_messages.length -1].text += "\n" + message;
            } else {
                var message = {
                    name: user, colour: "#000000",
                    thumb: "assets/images/attendees/wong-thumb.png",
                    text: message
                }
                self.chat_messages.push(message);
            }

            // append message
            self.textarea = "";
            $timeout(function() { self.chatbox.scrollTop(self.chatbox[0].scrollHeight);});

            return true;
        }

        self.change_image = function(event, image_path) {
            angular.element('.image-selected').removeClass('image-selected');
            angular.element(event.currentTarget).addClass('image-selected');
            self.image_container.css('background-image', 'url("' + image_path + '")');
        }

        self.get_background = function(image_path) {
            return {
                'background-image': 'url(' + image_path + ')'
            }
        }

        self.toggle_dropdown = function() {
            angular.element('.dropdown-content').toggleClass("active");
        }

        self.select_status = function(status) {
            self.status = status;
            self.toggle_dropdown();
        }

        self.init();
    }

})();
