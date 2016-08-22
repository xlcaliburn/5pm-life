'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var multer  =   require('multer');
var fs = require('fs');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'client/uploads/profile');
    },
    filename: function (req, file, callback) {
        var file_type = file.mimetype.replace('image/', '');
        var filename = Date.now() + '.' + file_type;
        callback(null, filename);
    }
});
var upload = multer({ storage: storage }).single('userImage');

// check for file errors
function check_image(file) {

}

export function saveUserImage(req, res) {
    var response = {};
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
            fs.unlink('client/uploads/profile/1471842864276.jpeg');
            return res.json({ response: response });
        }
        
        response.status = 'ok';
        response.file = req.file.filename;

        return res.json({ response: response });
    })
}
