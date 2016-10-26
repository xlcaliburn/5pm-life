'use strict';

var email_controller = require('../email/email.controller');
var VerificationEmail = require('../email/templates/email.verification');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Enums = require('../enums/enums.controller');
import enumsJSON from '../enums/enums.json';

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

function valid_email(email_address) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email_address);
}

function validate_user(data) {
    // back-end validation
    /* data-fields:
        - first_name
        - last name
        - birthday: year, month, day
        - ethnicity: ['Caucasian', 'African', 'South East Asian', 'Native American', 'Indian', 'Middle East', 'Mixed', 'Other']
        - gender: ['Male', 'Female']
        - email_address
    */

    var error_message;
    var response = {};
    var i;

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
        { type: 'year', min: new Date().getFullYear() - 100, max: new Date().getFullYear() - 1 }
    ];

    for (i = 0; i < valid_ranges.length; i++) {
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
    //var valid_ethnicity = ['Caucasian', 'Latino/Hispanic', 'African', 'Caribbean', 'South Asian', 'East Asian', 'Mixed', 'Other'];

    // check blank inputs
    if (!enumsJSON.ethnicity[data.ethnicity]) { error_message = "Please select an ethnicity";}
    else if (!enumsJSON.gender[data.gender]) { error_message = "Please select a gender"; }


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

    // invalid email address
    else if (!valid_email(data.email_address)) {
        error_message = "Please enter a valid email address";
    }

    if (error_message) {
        response.status = 'error';
        response.error_message = error_message;
        response.stage = 3;
        return response;
    }

    // no errors
    response.status = 'ok';
    response.user = {};

    // add fields
    response.user.first_name = data.first_name;
    response.user.last_name = data.last_name;
    response.user.ethnicity = data.ethnicity;
    response.user.gender = data.gender;
    response.user.email = data.email_address.toLowerCase();

    // change birthday to date
    var bday_string = data.birthday.year + '-' + data.birthday.month + '-' + data.birthday.day;
    response.user.birthday = new Date(bday_string);

    return response;
}

export function validate_save(req, res) {
    // validate first
    var response = validate_user(req.body);
    if (response.status === 'ok') {

        return User.findById(req.user._id).exec()
        .then((user) => {
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.email_address = req.body.email_address.toLowerCase();
            user.ethnicity = req.body.ethnicity;
            user.gender = req.body.gender;
            user.birthday = new Date(req.body.birthday.year + '/' + req.body.birthday.month + '/' + req.body.birthday.day);
            user.verified = true;
            return user.save();
        })
        .then(() => {
            return res.json({response: response});
        })
        .catch(handleError(res));
    } else {
        return res.json({response: response});
    }
}
