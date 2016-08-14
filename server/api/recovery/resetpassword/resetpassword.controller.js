'use strict';

var email_controller = require('../../email/email.controller');
var ResetPasswordEmail = require('../../email/templates/email.passwordrecovery');
var mongoose = require('mongoose');
var User = mongoose.model('User');

export function validate_user_id(req, res, next) {
    var response = {};
    var client = req.body;

    if (!client.id.match(/^[0-9a-fA-F]{24}$/)) {
        response.status = 'unauthorized';
        return res.json({ response: response });
    }

    User.findOne({ _id: client.id }, '-salt -password').exec()
        .then(function(user) {
            if (!user) {
                response.status = 'unauthorized';
                return res.json({ response: response });
            }

            // check if user has password_reset = true
            if (!user.password_reset) {
                response.status = 'unauthorized';
                return res.json({ response: response });
            }

            // passes all checks, return good json
            response.status = 'ok';
            return res.json({ response: response });
        })
        .catch(function(err) {
            response.status = 'error';
            response.error_message = 'Something went wrong. Please try again';
            response.errors = err;
            return res.json({ response: response });
        });
    return null;
}

export function reset_password(req, res, next) {
    var client = req.body;
    var response = {};

    // validate passwords first
    var valid_password = validate_passwords(client);
    if (valid_password) {
        response.status = valid_password.status;
        return res.json({ response: response });
    }

    User.findOne({ _id: client.id }, '-salt -password').exec()
        .then(function(user) {

            if (!user) {
                console.log('no such user');
                response.status = 'unauthorized';
                return response;
            }

            // check to see if their reset_password = true
            if (!user.password_reset) {
                console.log('no reset password');
                response.status = 'unauthorized';
                return res.json({ response: response });
            }

            // if so change to false and change their password
            user.password_reset = false;
            user.password = client.password;
            user.save()
                .then(function(user) {
                    response.status = 'ok';
                    return res.json({ response: response });
                })
                .catch(function(err) {
                    response.status = 'error';
                    response.errors = err;
                    return res.json({ response: response });
                });
            return null;
        })
        .catch(function(err) {
            response.status = 'error';
            response.errors = err;
            return res.json({ response: response });
        });

    return null;
}

function validate_passwords(client) {
    var result = {};

    // check password is empty
    if (!client.password) {
        result.status = 'empty_password';
        return result;
    }

    // check if passwords match
    if (client.password != client.confirm_password) {
        result.status = 'password_mismatch';
        return result;
    }

    // check if password is at least 8 characters
    if (client.password.length < 8) {
        result.status = 'short_password';
        return result;
    }

    return false;
}
