(function() { 'use strict';
    angular
        .module('fivepmApp')
        .controller('SettingsController', SettingsController);

    function SettingsController($scope, enumsData, Months, SettingsService, userData, Users) {
        var vm = this;

        // model
        vm.user = userData;
        vm.enums = enumsData;

        // functions
        vm.formatBirthday = formatBirthday;
        vm.getAge = getAge;
        vm.getEthnicity = getEthnicity;
        vm.getGender = getGender;
        vm.selectImage = selectImage;
        vm.uploadImage = uploadImage;

        // get user's age based on birthday
        function getAge() {
            return moment().diff(vm.user.birthday, 'years');
        }

        // get ethnicty value
        function getEthnicity() {
            return vm.enums.ethnicity[vm.user.ethnicity].value;
        }

        // get gender value
        function getGender() {
            return vm.enums.gender[vm.user.gender].value;
        }

        // format birthday to return age
        function formatBirthday() {
            return moment(vm.user.birthday).utc().format('MMMM DD, YYYY');
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
            });
        }
    }
})();
