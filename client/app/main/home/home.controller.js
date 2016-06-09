'use strict';

(function() {
    angular
    .module('5pmApp')
    .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($rootScope) {
        console.log($rootScope.title);
        console.log('Displaying home controller');
    }

})();
