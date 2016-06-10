'use strict';

(function () {
    angular.module('fivepmApp').controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($rootScope) {
        console.log($rootScope.title);
        console.log('Displaying home controller');
    }
})();
//# sourceMappingURL=home.controller.js.map
