'use strict';

import User from '../../user/user.model';

export function verify(req, res, next) {
    var user_id = req.params.id;
    var response = {};

    return User.findById(user_id).exec()
        .then(user => {
            if (!user) {
                response.status = 'error';
                response.message = 'Account does not exist';
                return res.json({ response: response });
            }

            // cehck if user is already verified
            if (user.verified) {
                response.status = 'error';
                response.message = 'Account has already been verified';
            } else {
                // change their verified status
                user.verified = true;
                return user.save()
                    .then(() => {
                        response.status = 'ok';
                        response.message = 'Your account has now been verified';
                        return res.json({response: response });
                    })
                    .catch(function(err) {
                        response.status = 'error';
                        response.message = err;
                        return res.json({response: response });
                    });
            }
            return res.json({ response: response });
        })
        .catch(function(err) {
            response.status = 'error';
            response.message = err;
            return res.json({response: response });
        });
}
