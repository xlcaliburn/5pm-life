(function() { 'use strict';
    angular
        .module('fivepmApp')
        .factory('feedbackService', FeedbackService);

    function FeedbackService($http) {
        return {
            submitFeedback: function(data) {
                return $http.post('/api/feedback', data);
            }
        };
    }
})();
