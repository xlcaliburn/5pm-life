'use strict';

import Email from './email.model';
var nodemailer = require("nodemailer");
var smtp_transport = require('nodemailer-smtp-transport');

export function sendEmail(email_content) {
    console.log('Attempting to send email to', email_content.to, '...');

    // trying nodemailer
    var transporter = nodemailer.createTransport(smtp_transport({
        service: 'gmail',
        auth: {
            user: 'fivepm.life@gmail.com', // my mail
            pass: 'fivepm4life'
        }
    }));

    // default options
    var mailOptions = {
        from: '5PM.life <fivepm.life@gmail.com>', // sender address
        to: email_content.to, // the same mail = want to send it to myself
        subject: 'Thank you for signing up!', // Subject line
        text: 'Thank you for signing up for our BETA. You will hear back from us very soon!', // plaintext body
        html: '<b>Thank you</b><p>Thank you for signing up for our BETA. You will hear back from us very soon!</p><p>Sincerely,<br>5PM Team</p>' // html body
    };

    if (email_content.to) { mailOptions.to = email_content.to; }
    if (email_content.subject) { mailOptions.subject = email_content.subject; }
    if (email_content.text) { mailOptions.text = email_content.text; }
    if (email_content.html) { mailOptions.html = email_content.html; }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return console.log(error);
        }
        console.log('Message sent to : ' + email_content.to + ' with ' + info.response);
    });
}

export function send_email(req, res) {
    sendEmail(req.body.email_address);
    return res.json({ status: "success" });
}
