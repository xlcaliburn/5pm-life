'use strict';

export function get_text_version(user) {
    /* require following fields:
        - first name (user.first_name)
        - id (user.id)
    */
    var text_body = '' +
    'Dear ' + user.first_name + ',\r\n\r\n' +
    'You have requested to reset your password. Please click on the link below to reset your password:\r\n\r\n' +

    user.password_recovery_link + '\r\n\r\n' +

    'Cheers,\r\n' +
    '5PMLIFE Team\r\n\r\n' +

    'Do not forward this email. The verify link is private';

    return text_body;
}

export function get_html_version(user) {

    var html_body = '' +

    '<div style="width: 700; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">' +
    '<img src="http://staging.5pm.life/assets/images/5pm-logo-blue-edbf85b339.png" height="35" width="auto">' + '<hr>' +

    '<p style="font-family: Arial, sans-serif;">Dear ' + user.first_name + ',<br><br>' +
    'You have requested to reset your password. Please click on the link below to reset your password:</p>' +

    '<p style="font-family: Arial, sans-serif;">Please click on the following link to verify your registration: </p>' +
    '<table cellspacing="0" cellpadding="0"><tr><td align="center" width="150" height="35" bgcolor="#f13c68" style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;"><a href="' + user.password_recovery_link + '" style="font-size:16px; text-decoration: none; font-weight: bold; font-family: Helvetica, Arial, sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block"><span style="color: #FFFFFF; font-size: 14px; font-family: Arial, sans-serif;">RESET PASSWORD</span></a></td></tr></table><br>' +

    '<p style="font-family: Arial, sans-serif;">Cheers,<br>' +
    '5PMLIFE Team</p><br>' +

    '<p><span style="color: #7f7f7f; font-family: Arial, sans-serif;">Do not forward this email. The verify link is private<br>' +
    'If the link above does not work, try this one: <a href="' + user.password_recovery_link + '" style="font-family: Arial, sans-serif;">' + user.password_recovery_link + '</a></p></div>';

    return html_body;

}
