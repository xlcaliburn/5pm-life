import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';

var ObjectId = Schema.ObjectId;

module.exports = function (mongoose) {
    var ChatSchema = new Schema({
        eventId: String,
        messages: [{
            user: { type: Schema.Types.ObjectId, ref : 'User' },
            message: String,
            timestamp: Date
        }]
    });

    var MessageSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref : 'User' },
        message: String,
        timestamp: Date
    });

    var chatModel = {
        Chat: mongoose.model('Chat', ChatSchema),
        Message: mongoose.model('Message', MessageSchema)
    };

    return chatModel;
};
