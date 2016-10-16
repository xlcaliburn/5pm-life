/**
* Socket.io configuration
*/
'use strict';

import config from './environment';
import jwt from 'jsonwebtoken';
import User from '../api/user/user.model';

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

function getDecodedToken(token) {
	if (!token) {
		return false;
	}
	return jwt.verify(token, config.secrets.session);
}

// When the user connects.. perform this
function onConnect(socket) {
    // When the client emits 'info', this listens and executes
    socket.on('info', data => {
        socket.log(JSON.stringify(data, null, 2));
    });

    // Insert sockets below
    require('../api/thing/thing.socket').register(socket);

}

export default function(socketio) {
    // socket.io (v1.x.x) is powered by debug.
    // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
    //
    // ex: DEBUG: "http*,socket.io:socket"

    // We can authenticate socket.io users and access their token through socket.decoded_token
    //
    // 1. You will need to send the token in `client/components/socket/socket.service.js`
    //
    // 2. Require authentication here:
    socketio.use(require('socketio-jwt').authorize({
    secret: config.secrets.session,
    handshake: true
}));

socketio.on('connection', function(socket) {
    socket.address = socket.request.connection.remoteAddress +
    ':' + socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function(_data) {
        console.log('=====================================================');
        console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, _data);
        console.log('=====================================================');
    };

	// user logs into 5pm
	socket.on('join', function () {
		var user_token = socket.request._query.token;
		var user_id = getDecodedToken(user_token)._id;
		socket.join(user_id);
	});

	// user confirms event
	socket.on('confirm_event', function(eventRoom) {
		var user_token = socket.request._query.token;
		var user_id = getDecodedToken(user_token)._id;
		var error;

		// get user id, name, and profile picture
		User.findOne({ _id: user_id }, '_id first_name last_name profile_picture.current').exec()
		.then((user)=> {
			if (!user) { error = true; }
			var data = {
				user: user,
				status: 'join'
			};

			// emit message to clients
			socketio.sockets.in(eventRoom).emit('user_join_leave', data);
		})
		.catch((err)=> {
			// emit error
			socketio.sockets.in(eventRoom).emit('message_error');
		});
	});

	// join event when user enters an event page
    socket.on('join_event', function(eventRoom) {
        socket.join(eventRoom);
		socket.emit('fetch_chat');
    });

	socket.on('leave_event', function(eventRoom) {
		socket.leave(eventRoom);
		var user_token = socket.request._query.token;
		var user_id = getDecodedToken(user_token)._id;
		var error;

		// get user id, name, and profile picture
		User.findOne({ _id: user_id }, '_id first_name last_name profile_picture.current').exec()
		.then((user)=> {
			if (!user) { error = true; }
			var data = {
				user: user,
				status: 'leave'
			};

			// emit message to clients
			socketio.sockets.in(eventRoom).emit('user_join_leave', data);
		})
		.catch((err)=> {
			// emit error
			socketio.sockets.in(eventRoom).emit('message_error');
		});
	});

    // receiving message from client via event
    socket.on('send_message', function(data) {
		console.log('Socket data', data);
        var user_token = socket.request._query.token;
        var user_id = getDecodedToken(user_token)._id;
        var error;

        // get user id, name, and profile picture
        User.findOne({ _id: user_id }, '_id first_name last_name profile_picture.current').exec()
        .then((user)=> {
            if (!user) { error = true; }
            var message_data = {
                user: user,
                message: data.message
            };

            // emit message to clients
            socketio.sockets.in(data.event_id).emit('receive_message', message_data);
        })
        .catch((err)=> {
            // emit error
            socketio.sockets.in(data.event_id).emit('message_error');
        });

    });

    // Call onDisconnect.
    socket.on('disconnect', () => {
        onDisconnect(socket);
        socket.log('DISCONNECTED');
    });

    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');
});
}
