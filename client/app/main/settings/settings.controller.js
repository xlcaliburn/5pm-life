(function() { 'use strict';
    angular
        .module('fivepmApp')
        .controller('SettingsController', SettingsController);

    function SettingsController($scope, enumsData, SettingsService, userData, Users, $uibModal) {
        var vm = this;
        vm.user = userData;
        vm.enums = enumsData;
        vm.getAge = () => moment().diff(vm.user.birthday, 'years');
        vm.getEthnicity = () => typeof vm.enums.ethnicity[vm.user.ethnicity] === 'undefined' ? vm.user.ethnicity : vm.enums.ethnicity[vm.user.ethnicity].value;
        vm.getGender = () => vm.enums.gender[vm.user.gender].value;
        vm.selectImage = selectImage;
        vm.uploadImage = uploadImage;
        vm.submit = submit;
        vm.getDate = getDate;
        vm.userEditModal = userEditModal;
        vm.showAdjectiveEditPrompt = showAdjectiveEditPrompt;

        init();

        function init() {
            $(document).ready(function(){
                $('ul.tabs').tabs();
            });
        }

        // open file picker
        function selectImage() {
            angular.element('input[name="userImage"]').click();
        }

        // upload new image
        function uploadImage(target) {
            var target_input = angular.element(target)[0].files;
            var input_file = target_input[0];
            var formData = new FormData();

            formData.append('userImage', input_file);
            SettingsService.uploadProfilePicture(formData)
                .then(function(res) {
                    var response = res.data.response;
                    if (response.status === 'ok') {
                        Users.getMe()
                        .then(function(res) {
                            vm.user = res.data;

                            // update user info for navbar
                            $scope.$emit('updateUser');
                        });
                    }
                })
            ;
        }

        function submit() {
            Users.updateById(vm.user._id, vm.user)
                .success(function() {
                    Materialize.toast('Saved!', 2000); // jshint ignore:line
                });
        }

        function getDate(timeStamp){
            return moment(timeStamp).format('MMM DD, YYYY');
        }

        function userEditModal() {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/main/settings/modals/userEditModal.html',
                controller: 'UserEditModalController',
                controllerAs:'vm',
                size: 'sm',
                resolve: {
                    user : function() { return vm.user; }
                }
            });

            modalInstance.result.then(() => {});
        }

        function showAdjectiveEditPrompt() {
          return !vm.user.adjectives || vm.user.adjectives.length === 0;
        }
    }
})();
