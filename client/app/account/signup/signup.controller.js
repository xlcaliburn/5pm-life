'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('SignupController', SignupController);

    /** @ngInject */
    /* jshint expr: true */
    function SignupController() {
        var vm = this;

        // using my birthday as an example
        vm.age = moment().diff(moment('19900326', 'YYYYMMDD'), 'years');
    }

})();
