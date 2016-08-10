'use strict';

var email_controller = require('../email/email.controller');

function validate_user(data) {
    // back-end validation
    /* data-fields:
        - first_name
        - last name
        - birthday: year, month, day
        - ethnicity: ['Caucasian', 'African', 'South East Asian', 'Native American', 'Indian', 'Middle East', 'Mixed', 'Other']
        - gender: ['Male', 'Female']
        - email_address
        - password
        - confirm password
    */

    var error_message;
    var response = {};

    /* Personal Information
    ************************************************/
    // empty inputs
    if (!data.first_name) { error_message = "Please enter your first name"; }
    else if (!data.last_name) { error_message = "Please enter your last name"; }
    else if (!data.birthday.day) { error_message = "Please enter your birth day"; }
    else if (!data.birthday.month) { error_message = "Please select your birth month"; }
    else if (!data.birthday.year) { error_message = "Please enter your birth year"; }

    // check for correct date
    var valid_ranges = [
        { type: 'day', min: 1, max: 31 },
        { type: 'month', min:1, max: 12 },
        { type: 'year', min: new Date().getFullYear() - 100, max: new Date().getFullYear() }
    ];

    for (var i = 0; i < valid_ranges.length; i++) {
        var birth_date = parseInt(data.birthday[valid_ranges[i].type]);
        if (birth_date < valid_ranges[i].min || birth_date > valid_ranges[i].max) {
            error_message = "Please enter a valid birthday " + valid_ranges[i].type;
        }
    }

    if (error_message) {
        response.status = 'error';
        response.error_message = error_message;
        response.stage = 1;
        return response;
    }

    /* Personal Details
    ************************************************/
    var valid_ethnicity = ['Caucasian', 'African', 'South East Asian', 'Native American', 'Indian', 'Middle East', 'Mixed', 'Other'];
    var valid_gender = ['Male', 'Female'];
    var i;

    // check blank inputs
    if (!data.ethnicity) { error_message = "Please select an ethnicity";}
    else if (!data.gender) { error_message = "Please select a gender"; }

    //check ethnicity
    if (valid_ethnicity.indexOf(data.ethnicity) < 0) { error_message = "Please select an ethnicity"; }

    // check gender
    if (valid_gender.indexOf(data.gender) < 0) { error_message = "Please select a gender"; }

    if (error_message) {
        response.status = 'error';
        response.error_message = error_message;
        response.stage = 2;
        return response;
    }

    /* Account Details
    ************************************************/
    // blank inputs
    if (!data.email_address) { error_message = "Please enter an email address"; }
    else if (!data.password) { error_message = "Please enter a password with a minimum length of 8"; }
    else if (!data.confirm_password) { error_message = "Please re-type your password"; }

    // invalid email address
    else if (!valid_email(data.email_address)) { error_message = "Please enter a valid email address"; }

    // short password length
    else if (data.password.length < 8) { error_message = "Please enter a password with a minimum length of 8"; }

    // password mismatch
    else if (data.password !== data.confirm_password) { error_message = "Your passwords do not match"; }

    if (error_message) {
        response.status = 'error';
        response.error_message = error_message;
        response.stage = 3;
        return response;
    }

    // no errors
    response.status = 'ok';
    return response;
}

function valid_email(email_address) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email_address);
}

export function validate_save(req, res) {
    // validate first
    var response = validate_user(req.body);

    // TODO: save them into db (make sure to promise chain)

    // TODO: write verification email
    email_controller.sendEmail(req.body.email_address);

    return res.json({response: response});
}