'use strict';

var email_controller = require('../email/email.controller');
var ResetPasswordEmail = require('../email/templates/email.passwordrecovery');
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

export function send_reset_link(req, res) {
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
                .then(function(user) {
                    response.status = 'ok';

                    // send email to user with new link
                    var user_details = {
                        first_name: user.first_name,
                        password_recovery_link: req.headers.origin + '/passwordreset/' + user.id
                    };
                    var email_content = {
                        to: user.email,
                        subject: '[5PMLIFE] Reset Password',
                        text: ResetPasswordEmail.get_text_version(user_details),
                        html: ResetPasswordEmail.get_html_version(user_details)
                    };
                    email_controller.sendEmail(email_content);
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
