'use strict';

(function() {
    angular
    .module('fivepmApp')
    .controller('SettingsController', SettingsController);

    /** @ngInject */
    function SettingsController(user, Months, SettingsService) {
        var vm = this;

        // model
        vm.user = user;

        // view
        vm.profile_picture = 'default_profile.png';

        // functions
        vm.get_name = get_name;
        vm.format_birthday = format_birthday;
        vm.get_age = get_age;
        vm.select_image = select_image;
        vm.upload = upload;

        // get user full name
        function get_name() {
            return vm.user.first_name + " " + vm.user.last_name;
        }

        // return readable birthday
        function format_birthday() {
            var birth_year = vm.user.birthday.substring(0,4);
            var birth_month = parseInt(vm.user.birthday.substring(5,7)) - 1;
            var birth_day = vm.user.birthday.substring(8,10);
            return Months[birth_month] + " " + birth_day + ", " + birth_year;
        }

        // get age based on user's birthday
        function get_age() {
            var birthday = new Date(vm.user.birthday);
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        // select new profile picture
        function select_image() {
            angular.element('input[name="userImage"]').click();
        }

        // upload profile picture
        function upload(target) {
            var target_input = angular.element(target)[0].files;
            var input_file = target_input[0];
            var formData = new FormData();

            formData.append('userImage', input_file);
            SettingsService.uploadProfilePicture(formData).then(function(res) {
                var response = res.data.response;
                if (response.status === 'ok') {
                    Materialize.toast('Profile picture updated', 6000);
                    if (!vm.user.profile_picture) {
                        vm.user.profile_picture = {
                            current: response.file
                        }
                    } else {
                        vm.user.profile_picture.current = response.file;
                    }
                }
            });
        }
    }

})();
