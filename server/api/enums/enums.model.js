'use strict';

import mongoose from 'mongoose';

var EnumsSchema = new mongoose.Schema({
	type : String,
	key : String,
	value : Number
});

export default mongoose.model('Enums', EnumsSchema);