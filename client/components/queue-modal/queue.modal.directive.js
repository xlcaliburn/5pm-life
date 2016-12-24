(function() {
    'use strict';
    angular
    .module('fivepmApp')
    .directive('queueModal', QueueModalDirective);

    /** @ngInject */
    function QueueModalDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'components/queue-modal/queue-modal.html',
            controller: QueueModalController,
            controllerAs: 'qm',
            bindToController: true
        };
        return directive;
    }

    /** @ngInject */
    function QueueModalController($state, $timeout, NavbarService, QueueService) {
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
            location: null
        };

        // variables
        vm.error = false;
        vm.event = null;
        vm.current_stage = 1;
        vm.queue_status = null;

        // functions
        vm.cancelQueue = cancelQueue;
        vm.nextStage = nextStage;
        vm.openQueueModal = openQueueModal;
        vm.prevStage = prevStage;

        init();

        function init() {
            getQueueStatus();
            initPlugins();
            completeQueue();
        }

        function completeQueue() {
            vm.queue.date = 'December 30, 2016';
            vm.queue.time.start = '06:00PM';
            vm.queue.time.end = '09:00PM';
            vm.queue.activity.active = true;
            vm.queue.location = 'Toronto';
        }

        // Cancel event search
        function cancelQueue() {
            QueueService.cancelQueue()
            .then(function(res) {
                getQueueStatus();
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
                    getQueueStatus();
                    angular.element('#queueModal').modal('hide');
                    resetQueueForm();
                    new PNotify({
                        title: 'Queue Successful',
                        text: 'You have been added to the queue.',
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
                        vm.current_stage = vm.error.stage;
                        goToStage(vm.error.stage);
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
                      { from: [2016,10,6], to: [2016,10,12]},
                      { from: [2016,10,20], to: [2016,10,26]},
                      { from: [2016,11,4], to: [2016,11,10]},
                      { from: [2016,11,18], to: [2016,11,24]},
                      { from: [2017,0,1], to: [2017,0,7]},
                      { from: [2017,0,15], to: [2017,0,21]},
                      { from: [2017,0,29], to: [2017,1,4]},
                      1,2,3,4,5
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

        // Initialize bootstrap plugins
        function initPlugins() {
            initDateTimePicker();
            $timeout(function() {
                angular.element('[data-toggle="tooltip"]').tooltip();
            });
        }

        // Gets queue status and display explore button accordingly
        function getQueueStatus() {
            NavbarService.getUserQueueStatus().then(function(res) {
                vm.queue_status = res.data.queue;
                vm.event = res.data.event || null;
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
            if (vm.current_stage === 4) { confirmQueue(); return; }
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
            vm.current_stage =1 ;
        }
    }
})();
