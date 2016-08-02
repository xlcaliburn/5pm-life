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
		var self = this;

		// variables
		self.no_input = true;
		self.nav_open = false;
		self.email_address;
		self.form;

		// menu
		self.menu_items = [
			{
				name: 'ABOUT',
				link: '#about'
			},
			{
				name: 'CONTACT',
				link: '#contact'
			}
			// ,
			// {
			//     name: 'FOLLOW',
			//     link: '#follow'
			// }
		];

		self.submit_email = function() {
			if (self.no_input) {
				angular.element('.no-input').removeClass('no-input');
				$timeout(function() {
					angular.element('.welcome-subscribe input').focus();
				}, 250);
				self.no_input = false;
				return;
			}

			// submit their email here
			clear_errors();
			var email_valid = validate_email();
			var subscribe_button = angular.element('.subscribe-button');
			subscribe_button.prop('disabled', true);
			subscribe_button.addClass('loading');
			$timeout(function() {
				if (email_valid) {
					angular.element('.welcome-subscribe').addClass('fading-out');
					$timeout(function() {
						submit_email();
						var subscribe_container = angular.element('.welcome-subscribe.fading-out');
						subscribe_container.html('Thank you for signing up. We\'ll notify you when the BETA is ready!');
						subscribe_container.removeClass('fading-out');
					}, 550);
				} else {
					angular.element('.welcome-errors').addClass('error');
					subscribe_button.removeClass('loading');
					subscribe_button.prop('disabled', false);
					$timeout(function() {
						angular.element('.welcome-subscribe input').focus();
					});
				}
			}, 1000);
		};

		self.go_to_section = function(section) {
			angular.element('html, body').animate({
				scrollTop: angular.element(section).offset().top
			}, 500);
		};

		// save email address in db
		function submit_email() {

			// create email object
			var email = {
				email_address: self.email_address
			};

			// do $http request to save email
			EmailService.sendEmail(email).then(function(res) {
				console.log(res);
				// update front end
			}, function (error) {
				console.log(error);
			});

		}

		// validate email address
		function validate_email() {
			if (!self.form.$valid || self.form.$pristine || !self.email_address) { return false; }
			return true;
		}

		// clear errors on submit
		function clear_errors() {
			angular.element('.welcome-errors').removeClass('error');
		}


		/*================ BACK TO TOP CONTAINER ================================ */
		var offset = 300,
			nav_offset = 100,
			//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
			offset_opacity = 1200,
			//duration of the top scrolling animation (in ms)
			scroll_top_duration = 700,
			//grab the "back to top" link
			$back_to_top = $('.cd-top');

		//hide or show the "back to top" link
		$(window).scroll(function(){
			( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
			if( $(this).scrollTop() > offset_opacity ) {
				$back_to_top.addClass('cd-fade-out');
			}

			if ($(this).scrollTop() > nav_offset) {
				angular.element('.welcome-nav').addClass('sticky-nav');
			} else {
				angular.element('.welcome-nav').removeClass('sticky-nav');
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
