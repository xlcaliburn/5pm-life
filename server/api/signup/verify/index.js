'use strict';

var express = require('express');
var controller = require('./verify.controller');

var router = express.Router();

// put routes here
router.get('/:id', controller.verify);

module.exports = router;
