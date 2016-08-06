'use strict';

(function() {

	/*jslint latedef:false*/
	angular
	.module('fivepmApp')
	.controller('WelcomeController', WelcomeController);

	/** @ngInject */
	/*jshint camelcase: false */
	/* jshint expr: true */
	function WelcomeController($http, $timeout, EmailService) {
		var vm = this;

		// scroll to discover section
		vm.discover = function() {
			angular.element('html, body').animate({
				scrollTop: angular.element('#discover').offset().top
			}, 1000);
		};

		vm.get_current_year = function() {
			var date = new Date();
			return date.getFullYear();
		}

		// scroll in animations
		var detect_distance = 700;

		$timeout(function() {
			var welcome_text = angular.element('.welcome-text-row');
			welcome_text.addClass('faded');
		})

		var feature = angular.element('.welcome-feature');
		var feature_offset = feature.offset().top - detect_distance;

		var cartoon_1 = angular.element('.cartoon-1');
		var cartoon_1_offset = cartoon_1.offset().top - detect_distance;

		var text_1 = angular.element('.feature-1-text');
		var text_1_offset = text_1.offset().top - detect_distance;

		var cartoon_2 = angular.element('.cartoon-2');
		var cartoon_2_offset = cartoon_2.offset().top - detect_distance;

		var text_2 = angular.element('.feature-2-text');
		var text_2_offset = text_2.offset().top - detect_distance;

		/*================ BACK TO TOP CONTAINER ================================ */
		var offset = 300,
			nav_offset = 100,
			offset_opacity = 1200,
			scroll_top_duration = 900,
			$back_to_top = $('.cd-top');

		//hide or show the "back to top" link
		$(window).scroll(function() {
			var window_scroll = $(this).scrollTop();

			// back to top
			if (window_scroll > offset) {
				$back_to_top.addClass('cd-is-visible')
			} else {
				$back_to_top.removeClass('cd-is-visible cd-fade-out');
			}
			if (window_scroll > offset_opacity) {
				$back_to_top.addClass('cd-fade-out');
			}

			// animations
			if (window_scroll > feature_offset) {
				feature.parent().addClass('faded');
			}
			if (window_scroll > cartoon_1_offset) {
				cartoon_1.addClass('faded');
			}
			if (window_scroll > text_1_offset) {
				text_1.addClass('faded');
			}
			if (window_scroll > cartoon_2_offset) {
				cartoon_2.addClass('faded');
			}
			if (window_scroll > text_2_offset) {
				text_2.addClass('faded');
			}
		});

		//smooth scroll to top
		$back_to_top.on('click', function(event){
			event.preventDefault();
			$('body,html').animate({
				scrollTop: 0 ,
				}, scroll_top_duration
			);
		});
		/*===================================================*/

	}

})();
