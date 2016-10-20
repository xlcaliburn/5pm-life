'use strict';

import _ from 'lodash';

var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var Message = mongoose.model('Message');
import Events from '../events/events.model';
var userController = require('../user/user.controller');

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log('error is', err);
		res.status(statusCode).send(err);
	};
}

// validate if user belongs to event
// params should contain event_id and user
function validate(params, res) {
    // TODO: check if event really exists

    // TODO: check if user is real

    // TODO: check if user is really participating in event (using token)

    // if everything is okay: return true;
    // else throw ('You are unauthorized to view this content');
    return true;
}

// store event chat message
export function store(req, res) {
    // find to see if chat exists
    var token_result = userController.getDecodedToken(req.cookies.token);
    var params = {
        event_id: req.body.event_id,
        user_id: token_result._id
    };
    var user_id = new mongoose.Types.ObjectId(token_result._id);
    var current_event;
    var status = 'success';
    var chatroom;
    var messageToBeSent;

    validate(params, res);
    return Promise.resolve(Events.findById(params.event_id))
    .then((event) => {
        current_event = event._id;
        if (!current_event) { throw('unauthorized'); }
    })
    .then(() => {
        return Promise.resolve(Chat.findOne({ eventId: current_event }));
    })
    .then((chat) => {
        if (current_event && !chat) {
            // create chat
            chatroom = new Chat({
                eventId: params.event_id,
                messages: []
            });
        } else if (current_event && chat) {
            chatroom = chat;
        }
    })
    .then(() => {
        // insert message
        var message = req.body.message;
        if (current_event && chatroom) {
            var newMessage = new Message({
                user: user_id,
                message: req.body.message,
                timestamp: new Date()
            });

            chatroom.messages.push(newMessage);

            messageToBeSent = {
                user: user_id,
                message: req.body.message,
                timestamp: new Date()
            };

            return Promise.resolve(chatroom.save());
        }
    })
    .then(() => {
        // return success
        return res.json({ status: status, message: messageToBeSent });
    })
    .catch(handleError(res));
}

// fetch event chat history
export function fetch(req, res) {
    var token_result = userController.getDecodedToken(req.cookies.token);
    var user_id = new mongoose.Types.ObjectId(token_result._id);
    var offset_id;
    if (req.query.offset) {
        offset_id = new mongoose.Types.ObjectId(req.query.offset);
    }

    var params = {
        event_id: req.params.event_id,
        user_id: token_result._id,
    };

    validate(params, res);
    return Promise.resolve(Chat.findOne({ eventId: params.event_id })
    .populate('messages.user', '_id first_name last_name profile_picture.current'))
    .then((chat) => {
        if (!chat) {
            throw ('No chat found');
        }

        // send array based on offset
        var raw_messages = chat.messages;
        raw_messages.sort(function(a,b) {
            return b.timestamp - a.timestamp;
        });

        // get position of last chat message
        var offset;
        var fetched_messages = [];
        var i = 0;
        if (!offset_id) {
            // get the first 100 messages or length of raw messages
            while (i < 100 && i <= raw_messages.length - 1) {
                fetched_messages.push(raw_messages[i]);
                i++;
            }
        } else {
            for (i = 0; i < raw_messages.length; i++) {
                if (raw_messages[i].user._id.equals(offset_id)) {
                    offset = i;
                }
            }
            var offset_end = offset + 100;
            while (offset < offset_end && offset < raw_messages.length - 1) {
                fetched_messages.push(raw_messages[offset]);
                offset++;
            }
        }

        // reverse order of messages to send so it sends it correct order
        fetched_messages.sort(function(a,b) {
            return a.timestamp - b.timestamp;
        });

        return res.json({ messages: fetched_messages });

    })
    .catch(handleError(res));
}
