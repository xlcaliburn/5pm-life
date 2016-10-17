'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var EnumsSchema = new Schema({
	type : String,
	key : String,
	value : String,
	order : Number
});

export default mongoose.model('Enums', EnumsSchema);
