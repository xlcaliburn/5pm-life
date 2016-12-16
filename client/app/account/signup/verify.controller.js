'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('VerifyController', VerifyController);

    function VerifyController($http, $stateParams) {
        var vm = this;

        vm.user_id = $stateParams.id;
        vm.api_url = '/api/signup/verify/' + vm.user_id;
        vm.message;
        vm.status;

        // make http request to verify email
        $http({
            method: 'get',
            url: vm.api_url,
        }).then(function successCallback(res) {
            console.log(res);
            var response = res.data.response;
            vm.status = response.status;
            vm.message = response.message;
        }, function errorCallback(res) {
            console.log(res);
            vm.message = 'There was an error trying to verify your email. Please try again.';
        });

    }

})();
