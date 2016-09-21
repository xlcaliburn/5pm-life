'use strict';

var fs = require('fs');

export function get_text_version(user) {
    /* require following fields:
        - first name (user.first_name)
        - id (user.id)
    */
    var text_body = '' +
    'Welcome ' + user.first_name + ',\r\n\r\n' +
    'Thank you for signing up on 5PMLIFE! Soon you will be able to meet new friends and discover events and venues around you. In order to use our service, you must verify your email address by clicking below:\r\n\r\n' +

    user.verification_link + '\r\n\r\n' +

    'Cheers,\r\n' +
    '5PMLIFE Team \r\n\r\n' +

    'Do not forward this email. The verify link is private';

    return text_body;
}

export function get_html_version(user) {

    var html_body = fs.readFileSync(__dirname + '/html/verification-email.html').toString();

    html_body = html_body.replace(/{{first_name}}/g, user.first_name);
    html_body = html_body.replace(/{{verification_link}}/g, user.verification_link);

    return html_body;

}
