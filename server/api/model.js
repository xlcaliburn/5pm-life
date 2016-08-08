var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Enum table for tags
module.exports = function(mongoose) {
	var Enums = new Schema ({
		enum_type : String,
		enum_name : String
	});

	var Venue = new Schema ({
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
		},
		category: [String], // Matchmaking parameter
		tags : [String]     // Internal use for filtering
	});

	var Event = new Schema ({
		activity : {
			enum_type : String,
			enum_name : String
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
			},
			category: [String], // Matchmaking parameter
			tags : [String]     // Internal use for filtering			
		},
		dt_search_start : Date,
		dt_search_end : Date,
		dt_start : Date,
		dt_end : Date,
		status : String,
		users : [ObjectId]
	});

	var AdminSettings = new Schema ({
		setting : String,
		value : String
	});

	var models = {
		Enums : mongoose.model('Enums', Enums),
		Venue : mongoose.model('Venue', Venue),
		Event : mongoose.model('Event', Event),
		AdminSettings : mongoose.model('AdminSettings', AdminSettings)
	};

	return models;
};