'use strict';

var express = require('express');
var controller = require('./resetpassword.controller');

var router = express.Router();

// put routes here
router.post('/', controller.validate_user_id);
router.put('/:id', controller.reset_password);

module.exports = router;
