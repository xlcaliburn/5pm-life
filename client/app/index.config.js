(function() {
  'use strict';

  angular
    .module('fivepmApp')
    .config(config)

    /** @ngInject */
    function config($logProvider) {

        // Enable log
        $logProvider.debugEnabled(true);

    }

})();
