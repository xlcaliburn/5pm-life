'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var ObjectId = Schema.ObjectId;

var PreferencesSchema = new Schema({
	user : {type : Schema.Types.ObjectId, ref : 'User'},
	activity_preferences : {
		activity : { type : Schema.Types.ObjectId, ref : 'Activity'},
		status : String
	}
});

export default mongoose.model('Preferences', PreferencesSchema);
