(function() { 'use strict';
    angular
        .module('fivepmApp')
        .controller('SettingsController', SettingsController);

    function SettingsController($scope, user, Months, SettingsService) {
        var vm = this;
        vm.user = user;
        vm.format_birthday = function() { return moment(vm.user.birthday).utc().format('MMMM DD, YYYY'); };
        vm.get_age = function() { return moment().diff(vm.user.birthday, 'years'); };
        vm.select_image = function() { angular.element('input[name="userImage"]').click(); };
        vm.upload = upload;
        vm.profile_picture = 'default_profile.png';

        function upload(target) {
            var target_input = angular.element(target)[0].files;
            var input_file = target_input[0];
            var formData = new FormData();

            formData.append('userImage', input_file);
            SettingsService.uploadProfilePicture(formData)
                .then(function(res) {
                    var response = res.data.response;
                    if (response.status === 'ok') {
                        Materialize.toast('Profile picture updated', 6000); // jshint ignore:line
                        if (!vm.user.profile_picture) {
                            vm.user.profile_picture = {
                                current: response.file
                            };
                        } else {
                            vm.user.profile_picture.current = response.file;
                        }

                        // update user info for navbar
                        $scope.$emit('updateUser');
                    }
                });
        }
    }
})();
