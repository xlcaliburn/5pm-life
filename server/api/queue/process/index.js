'use strict';
import {Router} from 'express';
var express = require('express');
var controller = require('./process.queue.controller');

var router = express.Router();

// add to queue
router.post('/', controller.addToQueue);

module.exports = router;
