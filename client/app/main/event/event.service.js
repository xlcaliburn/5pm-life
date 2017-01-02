(function() { 'use strict';
    angular
        .module('EventService', [])
        .factory('EventService', EventService);

    function EventService($http) {
        return {
            getEventModel: function(event_id) {
                var url = '/api/events/' + event_id;
                return $http.get(url);
            },
            getEventAttendees: function(event_id) {
                var url = '/api/events/attendees/' + event_id;
                return $http.get(url);
            },
            confirmEvent: function(event_details) {
                var url = '/api/events/confirm';
                return $http.post(url, event_details).then(function(res) {
                    return res.data;
                });
            },
            declineEvent: function(event_details) {
                var url = 'api/events/decline';
                return $http.post(url, event_details).then(function(res) {
                    return res.data;
                });
            },
            fetchEventChat: function(event_id, offset_id) {
                if (!offset_id) { offset_id = ''; }
                var url = 'api/chat/history/' + event_id;
                return $http.get(url).then(function(res) {
                    return res.data;
                });
            },
            leaveEvent: function(event_details) {
                var url = 'api/events/leave';
                return $http.post(url, event_details).then(function(res) {
                    return res;
                });
            }
        };
    }
})();
