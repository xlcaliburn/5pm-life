'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ActivitySchema = new Schema ({
	activity_name : String,
	tags : [String],
	allowed_capacity : Number,
	required_equipment : [String],
	duration : Number
});

export default mongoose.model('Activities', ActivitySchema);
