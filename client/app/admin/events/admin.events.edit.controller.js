(function() { 'use strict';
	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($scope, $q, $state, $uibModal, $stateParams, $timeout, Activities, Enums, Events, Queue, Users, Venues, EventService) {
		var vm = this;
		vm.event_id = $stateParams.event_id;
		vm.add_users = addUsersModal;
		vm.delete_event = deleteEvent;
		vm.end_event = endEvent;
		vm.remove_queue_from_event = removeQueueFromEvent;
		vm.trigger_event = triggerEvent;
		vm.submit = submit;
		vm.get_age = function(date){ return moment().diff(date, 'years');};
		vm.get_formatted_date = function(date) { return moment(date).format('MMM DD, YY | h:mm a');};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.enum_status = [];
		vm.form_date = null;
		vm.form_start_time = null;
		vm.form_end_time = null;
		vm.queues_to_add = [];
		vm.queues_to_remove = [];
		vm.selected_event = {};
		vm.event_users = [];

		init();

		/*jshint loopfunc: true */

		function init() {
			Venues.get()
				.then(function(res) {
					vm.allowed_venues = res.data;
					return Activities.get();
				})
				.then(function(res) {
					vm.allowed_activities = res.data;
					return res;
				})
				.then(function() {
					$timeout(function() {materialize_select();});
				})
				.catch(function(err) {console.log(err);});

			Events.getByIdAdmin(vm.event_id)
				.then(function(res) {
					vm.selected_event = res.data;
					vm.queues_to_add = vm.selected_event.queue;
					var start_date = new Date(vm.selected_event.dt_start);
					vm.form_date = moment(start_date).format('MMMM DD[,] YYYY');
					vm.form_start_time = moment(start_date).format('hh:mmA');
					vm.form_end_time = moment(new Date(vm.selected_event.dt_end)).format('hh:mmA');
					vm.event_users = vm.selected_event.users;
				})
				.then(function() {
					for (var add_id in vm.queues_to_add) {
						Queue
							.getById(vm.queues_to_add[add_id]._id)
							.then(function(res){
								vm.queues_to_add[add_id].user = res.data.user;
							});
					}
				})
				.catch(function(data) { console.log('Error: ' + data); });

			Enums.getByType('queue_status')
				.then(function(res) {
					vm.enum_status = res.data;
				})
				.catch(function(data) { console.log('Error: ' + data); });

			// init date
			var datepicker = angular.element('#datepicker');
			var yesterday = new Date((new Date()).valueOf()-1000*60*60*24);
			datepicker.pickadate({
				format: 'mmmm dd, yyyy',
				disable: [
					{ from: [0,0,0], to: yesterday },
					1,2,3,4,5,6
				],
				onSet: function( arg ){
					if ( 'select' in arg ){ //prevent closing on selecting month/year
						this.close();
					}
				},
				onOpen: function() {
					$('#datepicker_root>.picker__holder').show();
					angular.element('.picker__today').remove();
				}
			});

			var start_timepicker = angular.element('#start_timepicker');
			start_timepicker.pickatime({
				autoclose: true,
				twelvehour: true
			});
			var end_timepicker = angular.element('#end_timepicker');
			end_timepicker.pickatime({
				autoclose: true,
				twelvehour: true
			});
		}

		function addUsersModal() {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/admin/events/modals/eventAddUsersModal.html',
				controller: 'EventAddUsersModalController',
				controllerAs:'vm',
				size: 'lg',
				resolve: {
					eventId : function() { return vm.event_id; }
				}
			});

			modalInstance.result.then(function(data) {
				for (var queue_id in data) {
					if (data[queue_id] && !vm.queues_to_add.find(x => x._id === queue_id)) {
						Queue.getById(queue_id)
							.then(
								function(res){
									vm.queues_to_add.push(res.data);
								});
					}
				}
			}, function () {});
		}

		function triggerEvent() {
			// TODO: Add warning before calling this function
			updateQueueStatus(vm.enum_status.PENDING_USER_CONFIRM);
			vm.selected_event.status = vm.enum_status.PENDING_USER_CONFIRM;
			saveAndClose('Event started', true);
		}

		function submit() {
			updateQueueStatus(vm.enum_status.PENDING);
			vm.selected_event.dt_start = new Date(vm.form_date + ' ' + moment(vm.form_start_time, 'hh:mmA').format('HH:mm:00'));
			vm.selected_event.dt_end =  new Date(vm.form_date + ' ' + moment(vm.form_end_time, 'hh:mmA').format('HH:mm:00'));

			saveAndClose('Event saved');
		}

		function updateQueueStatus(newStatus) {
			for (var i=0; i < vm.queues_to_add.length; i++) {
				console.log(vm.queues_to_add[i]);

				Queue.put(vm.queues_to_add[i]._id, {status : newStatus})
					.catch(function(err) { console.log(err); }); // jshint ignore:line
			}

			// TODO: Make this a single call
			if (vm.queues_to_remove.length > 0) {
				for (var remove_id in vm.queues_to_remove) {
					var user_remove_id = vm.queues_to_remove[remove_id];
					if (vm.queues_to_remove[remove_id]._id) {
						user_remove_id = vm.queues_to_remove[remove_id]._id;
					}

					Queue.put(user_remove_id, {status : vm.enum_status.SEARCHING})
					.catch(function(err) { console.log(err); }); // jshint ignore:line
				}
			}
			vm.selected_event.queue = vm.queues_to_add;
		}

		function removeQueueFromEvent(id) {
			vm.queues_to_remove.push(id);
			vm.queues_to_add.splice(vm.queues_to_add.indexOf(id), 1);
		}

		function deleteEvent() {
			Events.delete(vm.selected_event._id)
			.success(function() {
				$state.go('admin.events', {}, { reload: true });
				Materialize.toast('Event deleted', 2000); // jshint ignore:line
			});
		}

		function endEvent() {
			for (var user in vm.selected_event.users)
			{
				// TODO: Very bad way of writing this, this should be addressed on the refactor. Move the code to server side
				var user_data;
				Users.getById(vm.selected_event.users[user])
					.then(function(res){
					user_data = res.data;
					user_data.event_status = null;
					user_data.event_history.push(vm.selected_event._id);
					user_data.current_event = null;
				}).then(function() {
					Users.updateById(vm.selected_event.users[user], user_data);
				});
			}

			vm.selected_event.status = vm.enum_status.ENDED;
			saveAndClose('Event ended', false);
		}

		function saveAndClose(notificationString, trigger) {
			Events.put(vm.selected_event._id, vm.selected_event)
				.success(function() {
					/* I had to put trigger event here, otherwise it'll break */
					if (trigger) {
						var queue_data = {
							event_id: vm.event_id,
							queues: vm.queues_to_add
						};

						Queue.triggerEventStart(queue_data).then(function(res) {
							console.log(res.data);
						});
					}

					$state.go('admin.events', {}, { reload: true });
					Materialize.toast(notificationString, 2000); // jshint ignore:line
				});
		}
	}
})();
