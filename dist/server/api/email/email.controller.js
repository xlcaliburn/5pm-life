'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.saveEmail = saveEmail;

var _email = require('./email.model');

var _email2 = _interopRequireDefault(_email);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodemailer = require("nodemailer");
var smtp_transport = require('nodemailer-smtp-transport');

function sendEmail(email_address) {
    console.log('Attempting to send email to', email_address);

    // trying nodemailer
    var transporter = nodemailer.createTransport(smtp_transport({
        service: 'gmail',
        auth: {
            user: 'fivepm.life@gmail.com', // my mail
            pass: 'fivepm4life'
        }
    }));

    var mailOptions = {
        from: '5PM.life <fivepm.life@gmail.com>', // sender address
        to: email_address, // the same mail = want to send it to myself
        subject: 'Thank you for signing up!', // Subject line
        text: 'Thank you for signing up for our BETA. You will hear back from us very soon!', // plaintext body
        html: '<b>Thank you</b><p>Thank you for signing up for our BETA. You will hear back from us very soon!</p><p>Sincerely,<br>5PM Team</p>' // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent to : ' + email_address + ' with ' + info.response);
    });
}

function saveEmail(req, res) {
    return _email2.default.create(req.body).then(function () {
        sendEmail(req.body.email_address);
        res.json({ status: "success" });
    });
}
//# sourceMappingURL=email.controller.js.map
