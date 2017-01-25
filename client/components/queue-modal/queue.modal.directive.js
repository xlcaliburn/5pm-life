(function() {
    'use strict';
    angular
    .module('fivepmApp')
    .directive('queueModal', QueueModalDirective);

    /** @ngInject */
    function QueueModalDirective($rootScope) {
        var directive = {
            restrict: 'E',
            scope: true,
            templateUrl: 'components/queue-modal/queue-modal.html',
            controller: QueueModalController,
            controllerAs: 'qm',
            bindToController: {
                mode: '@'
            },
            link: function(scope) {
                // Reset queue on event leave
                $rootScope.$on('reset_queue', scope.qm.resetQueue);
                $rootScope.$on('update_queue', scope.qm.getQueueStatus);
            }
        };
        return directive;
    }

    /** @ngInject */
    function QueueModalController($interval, $rootScope, $state, $timeout, QueueService, socket) {
        var vm = this;

        // views
        vm.queue = {
            date: null,
            time: {
                start: null,
                end: null
            },
            activity: {
                active: false,
                social: false
            },
            location: null,
            email: null
        };

        // variables
        vm.error = false;
        vm.event = null;
        vm.current_stage = 1;
        vm.current_state;
        vm.num_stages = 4;
        vm.queue_status = null;
        var eventSocket;

        // functions
        vm.cancelQueue = cancelQueue;
        vm.getQueueStatus = getQueueStatus;
        vm.nextStage = nextStage;
        vm.openQueueModal = openQueueModal;
        vm.prevStage = prevStage;
        vm.resetQueue = resetQueue;
        vm.viewEvent = viewEvent;

        init();

        function init() {
            getQueueStatus();
            initPlugins();

            // Show/hide event button depending on state
            $rootScope.$on('$stateChangeSuccess',
            function(event, toState){
                vm.current_state = toState.name;
            });
        }

        // Cancel event search
        function cancelQueue() {
            QueueService.cancelQueue()
            .then(function(res) {
                $rootScope.$emit('update_queue');
                if (res.status === 200) {
                    new PNotify({
                        title: 'Queue Cancelled',
                        text: 'You have cancelled the event search.',
                        type: 'info'
                    });
                }
            });
        }

        // Server-side validation + submit queue
        function confirmQueue() {
            QueueService.confirm(vm.queue)
            .then(function(res) {
                vm.error = res.data.error;
                if (!vm.error) {
                    $rootScope.$emit('update_queue');
                    angular.element('#queueModal').modal('hide');
                    resetQueueForm();
                    new PNotify({
                        title: 'Queue Successful',
                        text: 'You have been added to the queue. You will be notified when we find an event for you!',
                        type: 'success'
                    });
                } else {
                    // navigate to error tab and display error
                    if (!vm.error.stage) {
                        new PNotify({
                            title: 'Queue Error',
                            text: 'You are already in queue!',
                            type: 'error'
                        });
                        angular.element('#queueModal').modal('hide');
                        resetQueueForm();
                    } else {
                        new PNotify({
                            title: 'Queue Error',
                            text: 'Error processing queue. Please check your fields.',
                            type: 'error'
                        });
                    }
                }
            })
            .catch(function() { $state.go('logout'); });
        }

        // Initialize the date and time picker
        function initDateTimePicker() {
            $timeout(function() {
                // init date
                var datepicker = angular.element('#datepicker');
                var yesterday = new Date((new Date()).valueOf()-1000*60*60*24);
                datepicker.pickadate({
                    format: 'mmmm dd, yyyy',
                    disable: [
                      { from: [0,0,0], to: yesterday },
                      { from: [2016,11,1], to: [2017,0,20] },
                      { from: [2017,0,22], to: [2017,0,26] },
                      { from: [2017,0,28], to: [2017,1,26] },
                      { from: [2017,1,29], to: [2099,1,4] },
                      1,2,3,4,5
                    ],
                    onSet: function( arg ){
                        if ( 'select' in arg ){
                            //prevent closing on selecting month/year
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
                angular.element('#start_timepicker')
                .pickatime({
                    autoclose: true,
                    twelvehour: true
                });

                // init end time
                angular.element('#end_timepicker')
                .pickatime({
                    autoclose: true,
                    twelvehour: true
                });
            });
        }

        // Initialize bootstrap plugins
        function initPlugins() {
            initDateTimePicker();
            $timeout(function() {
                angular.element('[data-toggle="tooltip"]').tooltip();
            });
        }

        // init socket to change user queue status
        function initSockets() {
            if (!eventSocket) {
                eventSocket = socket.socket;
                eventSocket.emit('join');
                eventSocket.on('update_status', function() {
                    $rootScope.$emit('update_queue');
                    angular.element('#eventFoundModal').modal('show');
                });
                eventSocket.on('message_error', function() {
                    $state.go('logout');
                });
            }
        }

        // Gets queue status and display explore button accordingly
        function getQueueStatus() {
            QueueService.getStatus().then(function(res) {
                vm.queue_status = res.data.queue;
                vm.event = res.data.event || null;
                if (vm.queue_status) { initSockets(); }
            })
            .catch(function() {
                $state.go('logout');
            });
        }

        // go to specific stage
        function goToStage(stage) {
            $timeout(function() {
                angular.element('[href="#stage' + stage + '"]').click();
            });
        }

        // Go to next queue stage
        function nextStage() {
            if (vm.current_stage === vm.num_stages) { confirmQueue(); return; }
            // quick validator check
            vm.error = QueueService.validateStage(vm.current_stage, vm.queue);
            if (vm.error) { goToStage(vm.error.stage); }
            else {
                vm.current_stage++;
                goToStage(vm.current_stage);
            }
        }

        // Manual open of queue modal
        function openQueueModal() {
            angular.element('#queueModal').modal('show');
        }

        // Go back to previous queue stage
        function prevStage() {
            if (vm.current_stage === 1) { return; }
            vm.current_stage--;
            goToStage(vm.current_stage);
            vm.error = false;
        }

        // Reset queue + queue form
        function resetQueue() {
            $rootScope.$emit('update_queue');
            resetQueueForm();
        }

        // Reset the queue form
        function resetQueueForm() {
            vm.queue = {
                date: null,
                time: { start: null, end: null },
                activity: { active: false, social: false },
                location: null
            };
            goToStage(1);
            vm.current_stage = 1 ;
        }

        // Go to event link
        function viewEvent() {
            if (!vm.event) { return; }
            angular.element('#eventModalFound').modal('hide');
            $timeout(function() {
                $state.go('home.event', {id: vm.event.link});
            }, 300);
        }
    }
})();
