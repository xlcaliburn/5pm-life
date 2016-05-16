'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($http, $scope, socket) {
      _classCallCheck(this, MainController);

      this.$http = $http;
      this.socket = socket;
      this.awesomeThings = [];

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('thing');
      });
    }

    _createClass(MainController, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        this.$http.get('/api/things').then(function (response) {
          _this.awesomeThings = response.data;
          _this.socket.syncUpdates('thing', _this.awesomeThings);
        });
      }
    }, {
      key: 'addThing',
      value: function addThing() {
        if (this.newThing) {
          this.$http.post('/api/things', {
            name: this.newThing
          });
          this.newThing = '';
        }
      }
    }, {
      key: 'deleteThing',
      value: function deleteThing(thing) {
        this.$http.delete('/api/things/' + thing._id);
      }
    }]);

    return MainController;
  }();

  angular.module('5pmApp').component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });
})();
//# sourceMappingURL=main.controller.js.map
