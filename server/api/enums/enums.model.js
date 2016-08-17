'use strict';

import mongoose from 'mongoose';

var EnumsSchema = new mongoose.Schema({
	type : String,
	name : String,
	key : String,
	value : Number
});

export default mongoose.model('Enums', EnumsSchema);