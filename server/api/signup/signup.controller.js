'use strict';

function validate_save(data) {
    console.log(data);
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
}

export function validate_save(req, res) {
    console.log(req);
    // mongo shit
    /*return Email.create(req.body)
        .then(function() {
            sendEmail(req.body.email_address);
            res.json({ status: "success" });
        });
    */
}
