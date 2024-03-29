(function() { 'use strict';
    angular
        .module('fivepmApp')
        .directive('ngReallyClick', [function() {

            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('click', function() {
                        var message = attrs.ngReallyMessage;
                        if (message && window.confirm(message)) {
                            scope.$apply(attrs.ngReallyClick);
                        }
                    });
                }
            };
    }]);
})();
