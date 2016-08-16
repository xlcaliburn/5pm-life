'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ObjectId = Schema.ObjectId;

var EventsSchema = new Schema({
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
	user_queue : [{
		user_id : ObjectId,
		first_name : String,
		last_name : String,
		queue_dt_search_start : Date
	}]
});

export default mongoose.model('Events', EventsSchema);