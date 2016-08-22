'use strict';

var express = require('express');
var controller = require('./upload.controller');

var router = express.Router();

// put routes here
router.post('/', controller.saveUserImage);

module.exports = router;
