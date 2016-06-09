(function() {
  'use strict';

  angular
    .module('5pmApp.constants')
    .constant("allConfig", {
        "userRoles": [
            "guest",
            "user",
            "admin"
        ]
    })
    //.constant('BACKEND_DIR', 'http://stockmanager.dev/');

})();
