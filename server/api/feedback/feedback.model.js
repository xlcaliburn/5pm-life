'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ObjectId = Schema.ObjectId;

var FeedbackSchema = new Schema({
	user: { type : Schema.Types.ObjectId, ref : 'User'},
	type: String,
	description: String,
	date_created: Date
}, { collection: 'feedback' });

export default mongoose.model('Feedback', FeedbackSchema);
