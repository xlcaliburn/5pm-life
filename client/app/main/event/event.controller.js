'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('EventController', EventController);

    /** @ngInject */
    /*global google */
    /* jshint expr: true */
    function EventController($cookies, $rootScope, $timeout, attendees, event_data, EventService) {

        var vm = this;

        // model
        vm.attendees = attendees;
        vm.event_data = event_data;

        // variables
        var map, marker, infowindow, lat, lng;

        // functions
        vm.confirm_event = confirmEvent;
        vm.decline_event = declineEvent;
        vm.get_confirmed_attendees = getConfirmedAttendees;
        vm.get_event_date = getEventDate;
        vm.get_event_time = getEventTime;
        vm.get_googlemaps_link = getGoogleMapsLink;
        vm.get_profile_img = getProfileImg;
        vm.get_self_status = getSelfStatus;

        _init();

        function _init() {
            // set page title
            $rootScope.title = vm.event_data.activity.activity_name + ' at ' + vm.event_data.venue.venue_name;

            getLatLng();
            initPlugins();
        }

        // confirm event confirmation
        function confirmEvent() {
            var event_details = {
                id: vm.event_data._id,
                activity: vm.event_data.activity.activity_name,
                venue: vm.event_data.venue.venue_name,
                date: getEventDate(),
                time: getEventTime(),
                street: vm.event_data.venue.address.street,
                city: vm.event_data.venue.address.city,
                province: vm.event_data.venue.address.province,
                postal_code: vm.event_data.venue.address.postal_code,
                gmaps_link: getGoogleMapsLink(),
                attendees: getConfirmedAttendees()
            };
            console.log(event_details);
            EventService.confirmEvent(event_details).then(function(data) {
                console.log(data);
                if (data.response.status === 'ok') {
                    alert('Event confirmed!');
                }
            });
        }

        // decline event confirmation
        function declineEvent() {

        }

        // get latitude and longitude based on event address
        function getLatLng() {
            var venue_address = vm.event_data.venue.address;
            var geocoder = new google.maps.Geocoder();
            var address = venue_address.street + ', ' + venue_address.city + ', ' + venue_address.province;

            geocoder.geocode({ 'address': address }, function(res, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    lat = res[0].geometry.location.lat();
                    lng = res[0].geometry.location.lng();
                    initMap();
                }
            });
        }

        // init google maps using coordinates from address
        function initMap() {
            var myOptions = {
                zoom: 14,
                center: {lat: lat, lng: lng},
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            map = new google.maps.Map(document.getElementById('event-map'), {
                center: {lat: lat, lng: lng},
                zoom: 14,
                options: myOptions
            });

            infowindow = new google.maps.InfoWindow({
                content: vm.event_data.venue.venue_name
            });

            marker = new google.maps.Marker({
                position: {lat: lat, lng: lng},
                map: map,
                title: vm.event_data.venue.venue_name
            });

            marker.addListener('click', function() {
                if (infowindow) { infowindow.close(); }
                infowindow.open(map, marker);
            });
        }

        // returns your status
        function getSelfStatus() {
            for (var i = 0; i < vm.attendees.length; i++) {
                if (vm.attendees[i].status) {
                    return vm.attendees[i].status;
                }
            }
        }

        // gets list of confirmed attendees
        function getConfirmedAttendees() {
            var attendees_array = [];
            for (var i = 0; i < vm.attendees.length; i++) {
                if (!vm.attendees[i].status || vm.attendees[i].status === 'Confirmed') {
                    attendees_array.push(vm.attendees[i]);
                }
            }
            return attendees_array;
        }

        // return user profile image
        function getProfileImg(image_name) {
            return 'uploads/profile/' + image_name;
        }

        // extract date from event date
        function getEventDate() {
            var date = new Date(vm.event_data.dt_start);
            return moment(date).format('dddd, MMMM D, YYYY');
        }

        // extract event start and end time
        function getEventTime() {
            var start_date = new Date(vm.event_data.dt_start);
            var end_date = new Date(vm.event_data.dt_end);
            var start_time = moment(start_date).format('h:mmA');
            var end_time = moment(end_date).format('h:mmA');
            return start_time + ' to ' + end_time;
        }

        // init materialize plugins
        function initPlugins() {
            // tooltips
            angular.element('i[data-tooltip]').tooltip();
        }

        function getGoogleMapsLink() {
            return 'http://maps.google.com/?q=' + vm.event_data.venue.venue_name + ',' + vm.event_data.venue.address.city;
        }

    }

})();
