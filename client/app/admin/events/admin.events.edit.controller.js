(function() {
	'use strict';

	angular
		.module('fivepmApp.admin')
		.controller('EditEventController', EditEventController);

	function EditEventController ($scope, $q, $state, $uibModal, Months, $stateParams, $timeout, Enums, Queue, Events, Venues, Activities) {
		var vm = this;
		vm.event_id = $stateParams.event_id;
		vm.selected_event = {};
		vm.allowed_activities = {};
		vm.allowed_venues = {};
		vm.delete_event = deleteEvent;
		vm.add_users = addUsersModal;
		vm.submit = submit;
		vm.remove_queue_from_event = removeQueueFromEvent;
		vm.form_date = null;
		vm.form_start_time = null;
		vm.form_end_time = null;
		vm.queues_to_add = [];
		vm.queues_to_remove = [];
		vm.enum_status = [];

		init();

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
				.catch(function(err) {
					console.log(err);
				});

			Events.getByIdAdmin(vm.event_id)
				.success(function(data) {
					vm.selected_event = data;
					vm.queues_to_add = vm.selected_event.queue;

					var start_date = new Date(vm.selected_event.dt_start);
					vm.form_date = Months[start_date.getMonth()] + " " + start_date.getDate() + ", " + start_date.getFullYear();
					vm.form_start_time = formatAMPM(start_date);
					vm.form_end_time = formatAMPM(new Date(vm.selected_event.dt_end));
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});


			Enums.getByType('queue_status')
				.success(function(data) {
					vm.enum_status = data;
				});


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
					angular.element('.picker__today').remove();
				}
			});

			// init start time
			var start_timepicker = angular.element('#start_timepicker');
			start_timepicker.pickatime({
				autoclose: true,
				twelvehour: true
			});

			// init end time
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
					if (data[queue_id] && vm.queues_to_add.indexOf(queue_id) === -1) {
						vm.queues_to_add.push(queue_id);
					}
				}
				
			}, function () {});
		}

		function updateQueueStatus(newStatus) {
			// TODO: Make this a single call
			for (var add_id in vm.queues_to_add) {
				Queue.put(vm.queues_to_add[add_id], {status : newStatus})
					.catch(function(err) { console.log(err); });
			}

			for (var remove_id in vm.queues_to_remove) {
				Queue.put(vm.queues_to_remove[remove_id], {status : vm.enum_status.SEARCHING})
					.catch(function(err) { console.log(err); });
			}

			vm.selected_event.queue = vm.queues_to_add;
		}

		function notifyUsers() {
			// TODO
		}

		function removeQueueFromEvent(id) {
			vm.queues_to_remove.push(id);
			vm.queues_to_add.splice(vm.queues_to_add.indexOf(id), 1);
		}

		function deleteEvent() {
			Events.delete(vm.selected_event._id)
				.success(function() {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event deleted', 2000);					
				});
		}

        function get_time(time_string) {
            var hour = parseInt(time_string.substr(0,2));
            var minute = time_string.substr(3,2);
            var ampm = time_string.substr(5,2);

            if (ampm === 'PM') {
                hour += 12;
            }

            return hour + ":" + minute + ":00 EDT";
        }

        function formatAMPM(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			hours = hours < 10 ? '0'+hours : hours;
			minutes = minutes < 10 ? '0'+minutes : minutes;
			var strTime = hours + ':' + minutes + ampm;
			return strTime;
		}

		function submit() {
			if (vm.selected_event.user_queue.length === vm.selected_event.allowed_capacity)
			{
			 	// TODO: Add warning 
			 	console.log('Event now set to active');

				updateQueueStatus(vm.enum_status.PENDING_USER_CONFIRM);
				notifyUsers();

				vm.selected_event.status = 'Active';
			}
			else
			{
				updateQueueStatus(vm.enum_status.PENDING);
			}

			vm.selected_event.dt_start = new Date(vm.form_date + " " + get_time(vm.form_start_time));
			vm.selected_event.dt_end = new Date(vm.form_date + " " + get_time(vm.form_end_time));
			
			Events.put(vm.selected_event._id, vm.selected_event)
				.success(function(data) {
					$state.go('admin.events', {}, { reload: true });
					Materialize.toast('Event saved', 2000);
				});
		}		
	}
})();