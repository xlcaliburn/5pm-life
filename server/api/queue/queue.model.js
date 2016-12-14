'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ObjectId = Schema.ObjectId;

var QueueSchema = new Schema({
		users : [{ type : Schema.Types.ObjectId, ref : 'User'}],
		status : String,
		search_parameters : {
			min_age : Number,
			max_age : Number,
			tags : [String],
			event_search_dt_start : Date,
			event_search_dt_end : Date,
			city : String
		},
		queue_start_time : Date,
		queue_end_time : Date
});

export default mongoose.model('Queue', QueueSchema);
