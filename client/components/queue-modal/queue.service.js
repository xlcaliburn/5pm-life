(function() { 'use strict';
    angular
        .module('fivepmApp')
        .factory('QueueService', QueueService);

    function QueueService($http) {
        return {
            cancelQueue: function() {
                return $http.get('api/queue/cancel/');
            },
            confirm: function(queue) {
                var serverQueue = createServerQueueObject(queue);
                return $http.post('/api/queue', serverQueue);
            },
            getStatus: function() {
                return $http.get('api/queue/user');
            },
            validateStage: function(stage, obj) {
                var queue = createQueueObject(obj);
                var error = false;

                switch (stage) {
                    case 1:
                        error = validateDateTime(queue['1']);
                        break;
                    case 2:
                        error = validateActivity(queue['2'].activity);
                        break;
                    case 3:
                        error = validateLocation(queue['3'].location);
                        break;
                    case 4:
                        if (queue['4'].email) {
                            error = validateEmail(queue['4'].email);
                        }
                        break;
                }
                return error;
            }
        };
    }

    // create queue object
    function createQueueObject(opts) {
        var queue = {
            1: { date: opts.date, start_time: opts.time.start, end_time: opts.time.end },
            2: { activity: [] },
            3: { location: opts.location },
            4: { email: opts.email }
        };
        if (opts.activity.active) { queue['2'].activity.push('active'); }
        if (opts.activity.social) { queue['2'].activity.push('social'); }

        return queue;
    }

    // create server queue object
    function createServerQueueObject(opts) {
        var queue = {
            event_start: new Date(opts.date + ' ' + moment(opts.time.start, ['h:mmA']).format('HH:mm:ss')),
            event_end: new Date(opts.date + ' ' + moment(opts.time.end, ['h:mmA']).format('HH:mm:ss')),
            tags: [],
            city: opts.location,
            email: opts.email
        };
        if (opts.activity.active) { queue.tags.push('active'); }
        if (opts.activity.social) { queue.tags.push('social'); }

        return queue;
    }

    // validates datetime object
    function validateDateTime(datetime) {
        // check for blank inputs
        for (var dt in datetime) {
            if (!datetime[dt]) {
                return {
                    stage: 1,
                    message: 'Please enter a valid date, starting time, and ending time.'
                };
            }
        }

        // check if end time > start time
        var start_time = parseInt(moment(datetime.start_time, ['h:mmA']).format('HHmm'));
        var end_time = parseInt(moment(datetime.end_time, ['h:mmA']).format('HHmm'));
        if (end_time < start_time) {
            return {
                stage: 1,
                message: 'Your starting time cannot be later than your end time.'
            };
        }

        // check if time range is at least 3 hours
        if (start_time + 300 > end_time) {
            return {
                stage: 1,
                message: 'Your available time range needs to be at least 3 hours.'
            };
        }

        return false;
    }

    // validates activity array
    function validateActivity (activityArray) {
        // check for blank selection
        if (activityArray.length === 0) {
            return {
                stage: 2,
                message: 'Please select an activity type.'
            };
        }

        return false;
    }

    // validate location
    function validateLocation (location) {
        if (!location) {
            return {
                stage: 3,
                message: 'Please select a location.'
            };
        }
        return false;
    }

    // validate email
    function validateEmail (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            return false;
        }
        return {
            stage: 4,
            message: 'Please enter a valid email address'
        };
    }
})();
