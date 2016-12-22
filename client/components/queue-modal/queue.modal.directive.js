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
    function QueueModalController($state, NavbarService) {
        var vm = this;

        // variables
        vm.queue_status = null;
        vm.event = null;

        // functions
        vm.open_queue_modal = openQueueModal;

        init();

        function init() {
            getQueueStatus();
        }

        // Gets queue status and display explore button accordingly
        function getQueueStatus() {
            NavbarService.getUserQueueStatus().then(function(res) {
                vm.queue_status = res.data.queue;
                vm.event = res.data.event || null;
                console.log(res);
            })
            .catch(function() {
                $state.go('logout');
            });
        }

        function openQueueModal() {

        }
    }
})();
