'use strict';

import mongoose from 'mongoose';

var EnumsSchema = new mongoose.Schema({
	type : String,
	key : String,
	value : String,
	order : Number
});

export default mongoose.model('Enums', EnumsSchema);
