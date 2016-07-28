'use strict';

import mongoose from 'mongoose';

var EmailSchema = new mongoose.Schema({
  email_address: String,
}, { collection: 'signup_for_beta' });

export default mongoose.model('Email', EmailSchema);
