'use strict';

var express = require('express');
var controller = require('./email.controller');

var router = express.Router();

// put routes here
router.post('/', controller.send_email);

module.exports = router;
