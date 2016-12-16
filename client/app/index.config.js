(function() {
  'use strict';

  /*jslint latedef:false*/

  angular
    .module('fivepmApp')
    .config(config);

    /** @ngInject */
    function config($logProvider) {

        // Enable log
        $logProvider.debugEnabled(true);

    }

})();
