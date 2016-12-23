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
    function QueueModalController($state, $timeout, NavbarService) {
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
        vm.error = null;
        vm.event = null;
        vm.current_stage = 1;
        vm.queue_status = null;

        // functions
        vm.nextStage = nextStage;
        vm.openQueueModal = openQueueModal;
        vm.prevStage = prevStage;

        init();

        function init() {
            getQueueStatus();
            initDateTimePicker();
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

        // Gets queue status and display explore button accordingly
        function getQueueStatus() {
            NavbarService.getUserQueueStatus().then(function(res) {
                vm.queue_status = res.data.queue;
                vm.event = res.data.event || null;
                // event object:
                // { id, activity, activity, venue}
            })
            .catch(function() {
                $state.go('logout');
            });
        }

        // Go to next queue stage
        function nextStage() {
            if (vm.current_stage === 4) { return; }
            vm.current_stage++;
            $timeout(function() {
                angular.element('[href="#stage' + vm.current_stage + '"]').click();
            });
        }

        // Manual open of queue modal
        function openQueueModal() {
            angular.element('#queueModal').modal('show');
        }

        // Go back to previous queue stage
        function prevStage() {
            if (vm.current_stage === 1) { return; }
            vm.current_stage--;
            $timeout(function() {
                angular.element('[href="#stage' + vm.current_stage + '"]').click();
            });
        }
    }
})();
