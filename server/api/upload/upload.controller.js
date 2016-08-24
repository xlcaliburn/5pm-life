'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var userController = require('../user/user.controller');
import jwt from 'jsonwebtoken';
import config from '../../config/environment';
var multer  =   require('multer');
var fs = require('fs');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'client/uploads/profile');
    },
    filename: function (req, file, callback) {
        var token = userController.getDecodedToken(req.cookies.token);
        var user_id = token._id;

        var file_type = file.mimetype.replace('image/', '');
        var filename = user_id + '-' + Date.now() + '.' + file_type;
        callback(null, filename);
    }
});
var upload = multer({ storage: storage }).single('userImage');

// check for file errors
function check_image(file) {

}


export function saveUserImage(req, res) {
    var response = {};
    var token = req.cookies.token;
    var token_result = userController.getDecodedToken(token);
    if (!token_result) {
        response.status = 'unauthorized';
        return res.json({ response: response });
    }
    upload(req, res, function(err) {
        if (err) {
            response.status = 'error';
            response.error = err;
            return res.json({ response: response });
        }

        // error checking for file
        var errors = check_image(req.file);
        if (errors) {
            response.status = 'error';
            response.errors = errors;
            fs.unlink('client/uploads/profile/' + req.file.filename);
            return res.json({ response: response });
        }

        var user_id = token_result._id;
        User.findOne({ _id: user_id }).exec()
            .then(function(user) {
                if (!user) {
                    response.status = 'unauthorized';
                    return res.json({ response: response });
                }

                // delete old image
                var old_image = user.profile_picture.current;
                console.log(old_image);
                if (old_image) {
                    fs.unlink('client/uploads/profile/' + old_image);
                }
                
                // save new one
                user.profile_picture.current = req.file.filename;
                user.save()
                    .then(function() {
                        response.status = 'ok';
                        response.file = req.file.filename;
                        return res.json({ response: response });
                    })
                return null;
            })
            .catch(function(err) {
                response.status = 'error';
                response.error = err;
                return res.json({ response: response });
            })
    })
}
