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
    function HomeController($timeout, sectionData) {
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
                beforeChange: function(event, slick, currentSlide, nextSlide) {
                    vm.current_section = nextSlide;
                }
            },
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        speed: 350,
                        draggable: true,
                        method: {}
                    },
                }
            ]
        };

        // functions
        vm.go_to_section = goToSection;
        vm.open_queue_modal = openQueueModal;

        init();

        function init() {
            setHomeInfo();
            initSlick();
        }

        // go to slick section
        function goToSection(index) {
            vm.slick_config.method.slickGoTo(index);
        }

        // initialize slick plugin
        function initSlick() {
            /*$timeout(function() {
                angular.element('slick').slick(vm.slick_config);
            });*/
        }

        // setup homepage info
        function setHomeInfo() {
            // news
        }

        // open queue modal
        function openQueueModal() {
            $timeout(function() {
                angular.element('#explore-button').click();
            });
        }

    }

})();
