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

        function addAdjective(adjective){
            if(adjective){
                adjective = adjective.trim();
                if(vm.user.adjectives.length < 3 && adjective.length > 0){
                    vm.user.adjectives.push(adjective);
                    vm.adjectiveText = '';
                }
            }
        }

        function removeAdjective(index) {
            vm.user.adjectives.splice(index,1);
        }

        function submit(){
            console.log('test');
            Users.updateById(vm.user._id, vm.user)
            .then(() => {$uibModalInstance.close();});
        }
    }
})();
