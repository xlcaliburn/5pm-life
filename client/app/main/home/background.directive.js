(function() {
    'use strict';

    angular
    .module('fivepmApp')
    .directive('background', BackgroundDirective);

    function BackgroundDirective() {
        return function (scope, element, attrs) {
            var url = attrs.background;
            element.css({
                'background-image': 'url("' + url + '")',
                'background-size' : 'cover'
            });
        };
    }

})();
