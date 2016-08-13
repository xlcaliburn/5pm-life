'use strict';

var email_controller = require('../email/email.controller');
var VerificationEmail = require('../email/templates/email.verification');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// validate email address
function valid_email(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// check parameters
function validate_reset(data) {
    // see if email address is legit
    var email_address = data.email_address;
    if (valid_email(email_address)) {
        return true;
    }
    return false;
}

function catch_error(err) {
    var response = {};
    response.status = 'error';
    response.error_message = 'Something went wrong. Please try again.';
    response.errors = err;
    return response;
}

export function reset_password(req, res) {
    var result = validate_reset(req.body);
    var email_address = req.body.email_address;
    var response = {};

    if (result) {
        // check to see if there is 1 user with current email
        return User.findOne({ email: email_address }).exec()
        .then(function(user) {
            if (!user) {
                response.status = 'error';
                response.error_message = 'This email address does not exist in our system.';
                return res.json({ response: response });
            }
            else {
                user.password_reset = true;
                user.save()
                .then(function() {
                    response.status = 'ok';
                    return res.json({ response: response });
                })
                .catch(function(err) {
                    response = catch_error(err);
                    return res.json({ response: response });
                });
            }
            return null;
        })
        .catch(function(err) {
            response = catch_error(err);
            return res.json({ response: response });
        });

    }
}
