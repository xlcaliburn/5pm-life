'use strict';

var express = require('express');
var controller = require('./signup.controller');

var router = express.Router();

// put routes here
router.post('/', controller.validate_save);

module.exports = router;
