'use strict';

import Email from './email.model';
var email = require("emailjs/email");

function sendEmail(email_address) {
    console.log('Attempting to send email to', email_address);
    var mailserver  = email.server.connect({
        user:    "omglalamail@gmail.com",
        password:"chankl123",
        host:    "smtp.gmail.com",
        ssl: true
    });

    // send the message and get a callback with an error or details of the message that was sent
    mailserver.send({
        text:    "Thank you for signing up for our BETA. You will hear back from us very soon!",
        from:    "5PM.life <omglalamail@gmail.com>",
        to:      email_address,
        subject: "Thank you for signing up!"
    }, function(err, message) {
        console.log(err || "Message sent");
    });
}

export function saveEmail(req, res) {
    return Email.create(req.body)
        .then(function() {
            sendEmail(req.body.email_address);
            res.json({ status: "success" });
        });
}
