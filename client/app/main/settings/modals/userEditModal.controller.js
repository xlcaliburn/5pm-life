'use strict';
(function() {
    angular
    .module('fivepmApp')
    .controller('UserEditModalController', UserEditModalController);

    function UserEditModalController($uibModalInstance, Users, user){
        var vm = this;
        vm.submit = submit;
        vm.user = user;
        vm.addAdjective = addAdjective;
        vm.removeAdjective = removeAdjective;
        vm.showAddAdjectiveRow = () =>
          (!vm.user.adjectives || vm.user.adjectives.length < 3);

        function addAdjective(adjective){
            if(adjective){
                adjective = adjective.trim();
                if(vm.user.adjectives.length < 3 && adjective.length > 0){
                    if (adjective.length > 15){
                        adjective = adjective.substring(0,15);
                    }
                    if (!vm.user.adjectives.includes(adjective)) {
                      vm.user.adjectives.push(adjective);
                    }
                    vm.adjectiveText = '';
                }
            }
        }

        function removeAdjective(index) {
            vm.user.adjectives.splice(index,1);
        }

        function submit(){
          addAdjective(vm.adjectiveText);

          Users.updateById(vm.user._id, vm.user)
          .then(() => {$uibModalInstance.close();});
        }
    }
})();
