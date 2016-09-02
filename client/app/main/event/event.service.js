(function() {

    'use strict';
    angular
    .module('EventService', [])
    .factory('EventService', EventService);

    function EventService($http) {
        return {
            getEventModel: function(event_id) {
                var url = "/api/events/" + event_id;
                return $http.get(url);
            },
            getEventAttendees: function(event_id) {
                var url = "/api/events/attendees/" + event_id;
                return $http.get(url);
            }
        }
    }
})();
