var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = function(mongoose) {
	var Enums = new Schema ({
		enum_type : String,
		enum_name : String
	});

	var Activity = new Schema ({
		activity_name : String,
		tags : [String],
		allowed_capacity : Number,
		required_equipment : [String]
	});

	var Venue = new Schema ({
		venue_name: String,
		allowed_activities: [{
			activity_name : String
		}],
		address: {
			street: String,
			city: String,
			province: String,
			postal_code: String,
			country: String
		},
		max_capacity : Number
	});

	var Event = new Schema ({
		activity : {
			activity_name : String,
			tags : [String],
			allowed_capacity : Number,
			required_equipment : [String]
		},
		venue : {
			venue_name: String,
			activity: [{
				activity_name : String
			}],
			address: {
				street: String,
				city: String,
				province: String,
				postal_code: String,
				country: String
			}
		},
		dt_search_start : Date,
		dt_search_end : Date,
		dt_start : Date,
		dt_end : Date,
		status : String,
		users : [ObjectId]
	});

	var Queue = new Schema ({
		user : ObjectId,
		status : Number, // 0 = None, 1 = Searching, 2 = Awaiting confirm, 3 = In an Event,
		event : [ObjectId],
		queue_start_time : Date,
		queue_end_time : Date
	},
	})

	var AdminSettings = new Schema ({
		setting : String,
		value : String
	});

	var models = {
		Enums : mongoose.model('Enums', Enums),
		Activity: mongoose.model('Activity', Activity),
		Venue : mongoose.model('Venue', Venue),
		Event : mongoose.model('Event', Event),
		AdminSettings : mongoose.model('AdminSettings', AdminSettings)
	};

	return models;
};