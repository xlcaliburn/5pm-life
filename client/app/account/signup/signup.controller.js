'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('SignupController', SignupController);

    /** @ngInject */
    /* jshint expr: true */
    function SignupController() {
        var vm = this;

        // inputs
        vm.first_name;
        vm.last_name;
        vm.birthday;

        vm.steps = [
            {
                stage: 1,
                order_id: 1,
                key: 'first_name',
                value: 'first name',
                type: 'input'
            },
            {
                stage: 1,
                order_id: 2,
                key: 'last_name',
                value: 'last name',
                type: 'input'
            },
            {
                stage: 1,
                order_id: 3,
                key: 'birthday',
                value: 'birthday',
                type: 'date'
            }
        ];

        // using my birthday as an example
        vm.age = moment().diff(moment('19900326', 'YYYYMMDD'), 'years');

    }

})();
