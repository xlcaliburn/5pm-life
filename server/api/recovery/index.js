'use strict';

var express = require('express');
var controller = require('./recovery.controller');

var router = express.Router();

// put routes here
router.post('/', controller.reset_password);

module.exports = router;
