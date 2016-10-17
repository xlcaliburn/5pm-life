'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var AdminSettingsSchema = new Schema ({
	setting : String,
	value : String
});

export default mongoose.model('AdminSettings', AdminSettingsSchema);
