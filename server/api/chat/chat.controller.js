'use strict';

import _ from 'lodash';

var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var Message = mongoose.model('Message');
var userController = require('../user/user.controller');

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log('error is', err);
		res.status(statusCode).send(err);
	};
}

// validate if user belongs to event
function validate(res) {

}

// store event chat message
export function store(req, res) {
    // find to see if chat exists
    var event_id = req.params.event_id;
    var token_result = userController.getDecodedToken(req.cookies.token);
    var user_id = new mongoose.Types.ObjectId(token_result._id);
    var offset = req.query.offset;
    var current_event;
    var status = 'success';
    var newChatroom;

    return Promise.resolve(Chat.find({ eventId: event_id }))
    .then((chat) => {
        current_event = chat.eventId;
        if (!current_event) { status = 'unauthorized'; }
    })
    .then((chat) => {
        if (current_event && !chat) {
            // create chat
            newChatroom = new Chat({
                eventId: event_id,
                message: []
            });
        } else if (current_event && chat) {
            newChatroom = chat;
        }
    })
    .then(() => {
        // insert message
        var message = req.body.message;
        if (current_event && newChatroom) {
            var newMessage = new Message({
                user: user_id,
                message: req.body.message,
                timestamp: new Date()
            });
            newChatroom.message.push(newMessage);
            return Promise.resolve(newChatroom.save());
        }
    })
    .then(() => {
        // return success
        return res.json({ status: status });
    })
    .catch(handleError(res));
}

// fetch event chat history
export function fetch(req, res) {


}
