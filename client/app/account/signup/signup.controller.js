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
        vm.birthday_day;
        vm.birthday_month;
        vm.birthday_year;

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

        angular.element('html').css('background-color','#ffffff');
        angular.element('body').css('background-color','#ffffff');

        vm.get_days = function(days) {
            var day_array = [];
            for (var i = 1; i < days + 1; i++) {
                day_array.push(i);
            }
            return day_array;
        };

        // using my birthday as an example
        vm.age = moment().diff(moment('19900326', 'YYYYMMDD'), 'years');

    }

})();
