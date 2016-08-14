var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = function(mongoose) {

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

	var AdminSettings = new Schema ({
		setting : String,
		value : String
	});

	var models = {
		Activity: mongoose.model('Activity', Activity),
		Venue : mongoose.model('Venue', Venue),
		AdminSettings : mongoose.model('AdminSettings', AdminSettings)
	};

	return models;
};