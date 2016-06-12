'use strict';

import mongoose from 'mongoose';

var EmailSchema = new mongoose.Schema({
  email_address: String,
});

export default mongoose.model('Email', EmailSchema);
