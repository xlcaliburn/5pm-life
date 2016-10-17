'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var VenueSchema = new Schema ({
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

export default mongoose.model('Venues', VenueSchema);
