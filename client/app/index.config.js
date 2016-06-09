(function() {
  'use strict';

  angular
    .module('5pmApp')
    .config(config)

    /** @ngInject */
    function config($logProvider) {

        // Enable log
        $logProvider.debugEnabled(true);

    }

})();
