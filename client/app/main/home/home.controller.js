'use strict';

(function() {

    angular
    .module('fivepmApp')
    .controller('HomeController', HomeController)
    .filter('trustHTML', htmlFilter);

    // trust html filter
    function htmlFilter($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }

    /** @ngInject */
    /* jshint expr: true */
    function HomeController($timeout, feedbackService, sectionData) {
        var vm = this;

        // model
        vm.about_data = sectionData.sections.about;
        vm.feedback_data = sectionData.sections.feedback;
        vm.news_data = sectionData.sections.news;
        vm.sections = sectionData.sections;

        // views
        vm.banner = sectionData.banner;
        vm.current_section = 0;
        vm.feedback_type = null;
        vm.feedback_description = '';
        vm.slick_config = {
            enabled: true,
            accessibility: false,
            autoplay: false,
            draggable: false,
            adaptiveHeight: true,
            slidesToShow: 1,
            infinite: false,
            waitForAnimate: false,
            speed: 0,
            arrows: false,
            method: {},
            event: {
                init: function() {
                    goToSection(0);
                },
                beforeChange: function(event, slick, currentSlide, nextSlide) {
                    vm.current_section = nextSlide;
                }
            },
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        speed: 350,
                        method: {}
                    },
                }
            ]
        };

        // variables
        vm.submitting = false;
        var feedback_modal;

        // functions
        vm.close_modal = closeModal;
        vm.go_to_section = goToSection;
        vm.open_queue_modal = openQueueModal;
        vm.submit_feedback = submitFeedback;

        init();

        function init() {
            setData();
            $timeout(function() {
                feedback_modal = angular.element('#feedback-modal');
            });
        }

        // close feedback modal
        function closeModal() {
            feedback_modal.closeModal();
        }

        // go to slick section
        function goToSection(index) {
            $timeout(function() {
                vm.slick_config.method.slickGoTo(index);
            });
        }

        // setup homepage info
        function setData() {
            // news
            // about
            // feedback
        }

        // open queue modal
        function openQueueModal() {
            $timeout(function() {
                angular.element('#explore-button').click();
            });
        }

        // submit feedback
        function submitFeedback() {
            if (vm.submitting) { return; }
            if (!vm.feedback_type) {
                Materialize.toast('Please select a feedback type.', 6000);
                return;
            } else if (!vm.feedback_description.trim()) {
                Materialize.toast('Please fill in your feedback', 6000);
                return;
            }

            vm.submitting = true;
            var data = {
                type: vm.feedback_type,
                description: vm.feedback_description
            };

            feedbackService.submitFeedback(data).then(function(res) {
                if (res.data.success) {
                    vm.feedback_type = '';
                    vm.feedback_description = '';
                    vm.submitting = false;
                    feedback_modal.openModal();
                    vm.submitting = false;
                }
            });
        }

    }

})();
