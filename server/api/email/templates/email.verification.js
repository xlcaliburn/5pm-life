'use strict';

var fs = require('fs');

export function get_text_version(user) {
    /* require following fields:
        - first name (user.first_name)
        - id (user.id)
    */
    var text_body = '' +
    'Welcome ' + user.first_name + ',\r\n\r\n' +
    '﻿Thank you for signing up on 5PMLIFE! Soon you will be able to meet new friends and discover events and venues around you. In order to use our service, you must verify your email address by clicking below:\r\n\r\n' +

    user.verification_link + '\r\n\r\n' +

    'Cheers,\r\n' +
    '5PMLIFE Team \r\n\r\n' +

    'Do not forward this email. The verify link is private';

    return text_body;
}

export function get_html_version(user) {

    var html_body = fs.readFileSync(__dirname + '/html/verification-email.html').toString();

    console.log(html_body);

    html_body = html_body.replace(/{{first_name}}/g, user.first_name);
    html_body = html_body.replace(/{{verification_link}}/g, user.verification_link);

    return html_body;

    /*return fs.readFile(__dirname + '/html/verification-email.html', 'utf8', function(err, html) {
        console.log(html);
        html_body = html;

        // replace user first name and verification email link
        html_body.replace("{{first_name}}", user.first_name);
        html_body.replace("{{verification_link}}", user.verification_link);

        return html_body;
    });

    /*var html_body = '' +

    '<div style="width: 700; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">' +
    '<img src="http://staging.5pm.life/assets/images/5pm-logo-blue-edbf85b339.png" height="35" width="auto">' + '<hr>' +

    '<p style="font-family: Arial, sans-serif;">Dear ' + user.first_name + ',<br><br>' +
    'Thank you for becoming a member of 5PMLIFE!</p>' +

    '<p style="font-family: Arial, sans-serif;">Please click on the following link to verify your registration: </p>' +
    '<table cellspacing="0" cellpadding="0"><tr><td align="center" width="150" height="35" bgcolor="#f13c68" style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;"><a href="' + user.verification_link + '" style="font-size:16px; text-decoration: none; font-weight: bold; font-family: Helvetica, Arial, sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block"><span style="color: #FFFFFF; font-size: 14px; font-family: Arial, sans-serif;">VERIFY EMAIL</span></a></td></tr></table><br>' +

    '<p style="font-family: Arial, sans-serif;">And don\'t forget to RSVP to our events to get all the updates you need. We look forward to meeting you very soon!</p>' +

    '<p style="font-family: Arial, sans-serif;">Cheers,<br>' +
    '5PMLIFE Team</p><br>' +

    '<p><span style="color: #7f7f7f; font-family: Arial, sans-serif;">Do not forward this email. The verify link is private<br>' +
    'If the email verifcation link does not work, try this one: <a href="' + user.verification_link + '" style="font-family: Arial, sans-serif;">' + user.verification_link + '</a></p></div>';

    return html_body;*/

}
