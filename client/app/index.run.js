(function() {
    'use strict';
    /*jslint latedef:false*/

    angular
    .module('fivepmApp')
    .run(runBlock);

    /** @ngInject */
    function runBlock() {

        // set PNotify theme
        PNotify.prototype.options.styling = 'bootstrap3';
        PNotify.prototype.options.buttons.sticker = false;
        PNotify.prototype.options.buttons.closer_hover = false;
        PNotify.prototype.options.delay = 6000;
        PNotify.prototype.options.before_init = function(notice) {
            setTimeout(function() {
                var span = $(notice.stack.context[0].querySelectorAll('.alert .glyphicon.glyphicon-remove'));
                span.html('close');
                span.addClass('material-icons');
                span.removeClass('glyphicon'); span.removeClass('glyphicon-remove');
            });
        };
    }

})();
